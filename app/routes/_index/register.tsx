import { Form } from "@remix-run/react";
import { Button } from "@saitamau-maximum/ui";
import { TextInput } from "~/components/ui/text-input";
import styles from "./register.module.css";

interface RegisterProps {
  error?: string;
  token?: string;
}

export function Register({ error, token }: RegisterProps) {
  return (
    <section>
      <h2>参加登録</h2>
      {token && (
        <div className={styles.token}>
          <p>トークンを発行しました</p>
          <p>トークン: {token}</p>
          <p>このトークンは大切に保管してください</p>
        </div>
      )}
      <Form method="post" className={styles.form}>
        <label className={styles.formItem}>
          チーム名
          <TextInput type="text" name="team_name" />
        </label>
        <label className={styles.formItem}>
          認証コード
          <TextInput type="password" name="verification_code" />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit">トークン発行</Button>
      </Form>
    </section>
  );
}
