import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/WebGLTile.js';
import { GeoTIFF } from "ol/source";
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
register(proj4);

const style = {
    color: [
      "case",
      ["!=", ["band", 2], 0],
      ["color", 147, 68, 144, 1],
      ["color", 0, 0, 0, 0]
    ]
  }
const tifLayer = new TileLayer({
  source: new GeoTIFF({
    sources: [
      {
        url: "test.tif",
        bands: [1]
      }
    ],
    sourceOptions: {
      allowFullFile: true,
    },
    interpolate: false,
    normalize: false
  }),
  visible: true,
  style: style
});

// turn this line on and off
// -------------------------
tifLayer.setStyle(style);
// -------------------------

// create map
let tifView = await tifLayer.getSource().getView();
const map = new Map({
  target: 'map',
  layers: [
    tifLayer
  ],
  view: new View({
    projection: tifView.projection,
    center: tifView.center,
    zoom: 14
  })
});

map.on("pointermove", (e) => {
  const pixel = map.getEventPixel(e.originalEvent);
  const value = tifLayer.getData(pixel);
  console.log(value);
});