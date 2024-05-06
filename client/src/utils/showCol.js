export default function showCol({ field, data, source, type, sourceField }) {
  if (type === "date")
    return data
      ? new Date(data).toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";
  else if (type === "source" || type === "select") {
    if (Array.isArray(sourceField)) {
      let string = "";
      sourceField.forEach(
        (el) => (string += source.find((el) => el._id === data)?.[el] + " ")
      );
      return string;
    } else {
      return source.find((el) => el._id === data)?.[sourceField];
    }
  } else if (type === "boolean") return data ? "+" : "-";
  else return data;
}
