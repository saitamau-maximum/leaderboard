import { Form } from "@remix-run/react";
import { Button } from "@saitamau-maximum/ui";
import { TextInput } from "~/components/ui/text-input";
import styles from "./register.module.css";

export function Register() {
  return (
    <section>
      <h2>参加登録</h2>
      <Form method="post" action="/login" className={styles.form}>
        <label className={styles.formItem}>
          チーム名
          <TextInput type="text" name="team_name" />
        </label>
        <label className={styles.formItem}>
          認証コード
          <TextInput type="password" name="password" />
        </label>
        <Button type="submit">トークン発行</Button>
      </Form>
    </section>
  );
}
