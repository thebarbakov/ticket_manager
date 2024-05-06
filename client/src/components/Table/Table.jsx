import { Button, Card, Pagination } from "react-bootstrap";
import BootstrapTable from "react-bootstrap/Table";
import showCol from "../../utils/showCol";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Table({
  config,
  filter,
  setFilter,
  data,
  editPage,
  onCreate,
  totalDocs,
}) {
  const [pagin, setPagin] = useState(null);
  const navigator = useNavigate();

  useEffect(() => {
    if (!totalDocs) return;
    const items = [];
    const maxPage = Math.ceil(totalDocs / filter.s);
    for (
      let number = maxPage > 6 ? (filter.p <= 1 ? 1 : filter.p - 1) : 1;
      number <= maxPage;
      number++
    ) {
      if (number > filter.p + 6) break;
      if ((number === filter.p + 6) & (maxPage > filter.p + 6)) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === filter.p}
            onClick={() => setFilter({ ...filter, p: number })}
          >
            ...
          </Pagination.Item>
        );
        items.push(
          <Pagination.Item
            key={maxPage}
            active={maxPage === filter.p}
            onClick={() => setFilter({ ...filter, p: maxPage })}
          >
            {maxPage}
          </Pagination.Item>
        );
        continue;
      }

      items.push(
        <Pagination.Item
          key={number}
          active={number === filter.p}
          onClick={() => setFilter({ ...filter, p: number })}
        >
          {number}
        </Pagination.Item>
      );
    }
    setPagin(items);
  }, [filter, totalDocs]);

  return (
    <Card className="mt-2">
      <div className="d-flex justify-content-end p-3">
        <Button
          variant="primary"
          onClick={() => (onCreate ? navigator(onCreate) : navigator(editPage))}
          type="submit"
        >
          Создать
        </Button>
      </div>
      <div style={{ overflow: "scroll" }}>
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
                    .map(
                      ({
                        field,
                        isTitle,
                        type,
                        sourceField,
                        source,
                        widthDiscount,
                      }) => (
                        <td key={field}>
                          {isTitle ? (
                            <Link to={editPage + "?id=" + row._id}>
                              <p className="fw-bold mb-0">
                                {showCol({
                                  field,
                                  data: row[field],
                                  type,
                                  sourceField,
                                  source,
                                })}
                              </p>
                              {config.find((col) => col.isSubtitle) && (
                                <p className="mb-0">
                                  {showCol({
                                    field: config.find((col) => col.isSubtitle),
                                    data: row[
                                      config.find((col) => col.isSubtitle).field
                                    ],
                                    type: config.find((col) => col.isSubtitle)
                                      ?.type,
                                    sourceField: config.find(
                                      (col) => col.isSubtitle
                                    )?.sourceField,
                                    source: config.find((col) => col.isSubtitle)
                                      ?.source,
                                  })}
                                  {config.find((col) => col.isSubSubtitle) &&
                                    " | " +
                                      showCol({
                                        field: config.find(
                                          (col) => col.isSubSubtitle
                                        ),
                                        data: row[
                                          config.find(
                                            (col) => col.isSubSubtitle
                                          ).field
                                        ],
                                        type: config.find(
                                          (col) => col.isSubSubtitle
                                        ).type,
                                        sourceField: config.find(
                                          (col) => col.isSubSubtitle
                                        ).sourceField,
                                        source: config.find(
                                          (col) => col.isSubSubtitle
                                        )?.source,
                                      })}
                                </p>
                              )}
                            </Link>
                          ) : (
                            showCol({
                              field,
                              data: row[field],
                              type,
                              sourceField,
                              source,
                              widthDiscount,
                            })
                          )}
                        </td>
                      )
                    )}
                </tr>
              ))}
          </tbody>
        </BootstrapTable>
      </div>
      {totalDocs ? (
        <>
          <Pagination className="d-none m-2 d-md-flex">
            <Pagination.First
              className={filter.p <= 1 ? "fw-bold" : "fw-normal"}
              onClick={(e) => setFilter({ ...filter, p: 1 })}
              disabled={filter.p <= 1}
            />
            <Pagination.Prev
              className={filter.p <= 1 ? "fw-bold" : "fw-normal"}
              onClick={(e) => setFilter({ ...filter, p: filter.p - 1 })}
              disabled={filter.p <= 1}
            />
            {pagin}
            <Pagination.Next
              className={
                filter.p >= Math.ceil(totalDocs / filter.s)
                  ? "fw-bold"
                  : "fw-normal"
              }
              onClick={(e) => setFilter({ ...filter, p: filter.p + 1 })}
              disabled={filter.p >= Math.ceil(totalDocs / filter.s)}
            />
            <Pagination.Last
              className={filter.p <= 1 ? "fw-bold" : "fw-normal"}
              onClick={(e) =>
                setFilter({
                  ...filter,
                  p: Math.ceil(totalDocs / filter.s),
                })
              }
              disabled={filter.p >= Math.ceil(totalDocs / filter.s)}
            />
          </Pagination>
          <Pagination className="m-0 d-md-none d-flex">
            <Pagination.Prev
              onClick={(e) =>
                setFilter({
                  ...filter,
                  p: filter.p === 1 ? 1 : filter.p - 1,
                })
              }
              disabled={filter.p === 1}
            />
            <Pagination.Next
              onClick={(e) =>
                setFilter({
                  ...filter,
                  p:
                    filter.p === Math.ceil(totalDocs / filter.s)
                      ? Math.ceil(totalDocs / filter.s)
                      : filter.p + 1,
                })
              }
              disabled={filter.p === Math.ceil(totalDocs / filter.s)}
            />
          </Pagination>
        </>
      ) : (
        ""
      )}
    </Card>
  );
}
