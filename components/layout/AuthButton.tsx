import { signInWithDiscord, signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <form action={signInWithDiscord}>
        <button type="submit" className="btn btn-ghost btn-sm">
          เข้าสู่ระบบ Discord
        </button>
      </form>
    );
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email;

  return (
    <form
      action={signOut}
      style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
    >
      <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
        {name}
      </span>
      <button type="submit" className="btn btn-ghost btn-sm">
        ออกจากระบบ
      </button>
    </form>
  );
}
