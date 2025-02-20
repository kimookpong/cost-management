import { executeQuery } from "@/lib/oracle";

export default async function handler(req, res) {
  try {
    // You can use a simple query to check the connection, such as selecting the current date
    const result = await executeQuery("SELECT SYSDATE FROM DUAL");
    res.status(200).json({ message: "Connection was successful!", result });
  } catch (error) {
    res.status(500).json({
      error: "Error connecting to the database",
      details: error.message,
    });
  }
}
