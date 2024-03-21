import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap/Table";
import showCol from "../../utils/showCol";

export default function Table({ config, filter, setFilter, data }) {
  return (
    <Card className="mt-2">
      <BootstrapTable striped hover>
        <thead>
          <tr>
            {config &&
              config
                ?.filter((el) => !el.isSubtitle && !el.isSubSubtitle)
                .map((field, index) => (
                  <th key={index}>{field.displayName}</th>
                ))}
          </tr>
        </thead>
        <tbody>
          {config &&
            data &&
            data?.map((row) => (
              <tr key={row._id}>
                {config
                  ?.filter((el) => !el.isSubtitle & !el.isSubSubtitle)
                  .map(({ field, isTitle }) => (
                    <td key={field}>
                      {isTitle ? (
                        <>
                          <p className="fw-bold">
                            {showCol({ field, data: row[field] })}
                          </p>
                          {config.find((col) => col.isSubtitle).length > 0 && (
                            <p className="fw-bold">
                              {showCol({
                                field: config.find((col) => col.isSubtitle),
                                data: row[
                                  config.find((col) => col.isSubtitle).field
                                ],
                              })}
                              {config.find((col) => col.isSubSubtitle).length >
                                0 &&
                                " " +
                                  showCol({
                                    field: config.find(
                                      (col) => col.isSubSubtitle
                                    ),
                                    data: row[
                                      config.find((col) => col.isSubSubtitle)
                                        .field
                                    ],
                                  })}
                            </p>
                          )}
                        </>
                      ) : (
                        showCol({ field, data: row[field] })
                      )}
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </BootstrapTable>
    </Card>
  );
}
