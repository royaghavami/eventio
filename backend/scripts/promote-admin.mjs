/**
 * Promote a user to ADMIN by email.
 * Usage: node scripts/promote-admin.mjs you@example.com
 */
import mysql from 'mysql2/promise';

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run promote-admin -- <email>');
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const [result] = await connection.execute(
  "UPDATE users SET role = 'ADMIN' WHERE email = ?",
  [email],
);

await connection.end();

const affected = result.affectedRows ?? 0;
if (affected === 0) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

console.log(`Promoted ${email} to ADMIN (${affected} row updated).`);
