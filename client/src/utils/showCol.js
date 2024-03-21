export default function showCol({ field, data, source }) {
  if (field.type === "date")
    return new Date(data).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  else if (field.type === "source")
    return source.find((el) => el._id === data)?.[field.sourceField];
  else if (field.type === "boolean") return data ? "+" : "-";
  else return data;
}
