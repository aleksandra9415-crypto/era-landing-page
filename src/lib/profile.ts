import { supabase } from "@/integrations/supabase/client";
import { clearPendingBirth, readPendingBirth, type PendingBirth } from "@/lib/pendingBirth";
import { clearPendingRef, readPendingRef } from "@/lib/referral";

/**
 * Создаёт профиль владельца, если его ещё нет, и записывает дату рождения из
 * pendingBirth. Данные из хранилища удаляются только после успешной записи.
 * Возвращает false, если запись не удалась.
 */
export async function ensureOwnerProfile(
  userId: string,
  pending: PendingBirth | null = readPendingBirth(),
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, birth_date")
    .eq("user_id", userId)
    .eq("is_owner", true)
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) return false;

  const existing = data?.[0];

  if (!existing) {
    const { error: insertError } = await supabase.from("profiles").insert({
      user_id: userId,
      name: "Мой профиль",
      is_owner: true,
      birth_date: pending?.date ?? null,
      birth_time: pending?.time ?? null,
      birth_place: pending?.place ?? null,
      referred_by: readPendingRef(),
    });
    if (insertError) return false;
    clearPendingBirth();
    clearPendingRef();
    return true;
  }

  // Профиль есть и дата в нём уже есть — второй раз ничего не спрашиваем.
  if (existing.birth_date) {
    clearPendingBirth();
    return true;
  }

  if (!pending?.date) return true;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      birth_date: pending.date,
      birth_time: pending.time ?? null,
      birth_place: pending.place ?? null,
    })
    .eq("id", existing.id);

  if (updateError) return false;
  clearPendingBirth();
  return true;
}
