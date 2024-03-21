function generateHall({ svgData, hall_id }) {
  let parsedSvgData = svgData;
  let parsedData = [];
  svgData.match(/\<circle.*\/>/g).forEach((place) => {
    const cx = place.match(/cx\=\"([0-9.]*)\"/);
    const cy = place.match(/cy\=\"([0-9.]*)\"/);
    const r = place.match(/r\=\"([0-9.]*)\"/);
    if (parsedData.find((el) => el.cy === cy)) {
      parsedData
        .find((el) => el.cy === cy)
        .places.push({
          cx,
          cy,
          r,
        });
    } else {
      parsedData.push({
        cy,
        places: [{ cx, cy, r }],
      });
    }
    parsedSvgData = parsedSvgData.replace(place, ``);
  });
  parsedData = parsedData.map((row) => {
    return {
      ...row,
      places: row.places.sort((a, b) => a.cx - b.cx),
    };
  });

  const places = [];
  parsedData.forEach((row, rind) => {
    row.places.forEach((place, pind) => {
      places.push({
        hall_id,
        row: parsedData.length - rind,
        place: row.places.length - pind,
        coordinate: {
          ...place,
        },
      });
    });
  });

  return { places, parsedSvgData };
}

module.exports = generateHall;
