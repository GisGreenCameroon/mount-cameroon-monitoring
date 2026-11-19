// 1. Define the area of interest (Buea, Cameroon)
var buea = ee.Geometry.Rectangle([9.1, 4.0, 9.4, 4.3]);

// Center the map on Buea
Map.centerObject(buea, 11);

// 2. Load Sentinel-2 satellite imagery
// We filter for the year 2025 and remove cloudy images
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(buea)
  .filterDate('2025-01-01', '2025-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .median(); // Take the median of all images to remove clouds

// 3. Calculate NDVI (Normalized Difference Vegetation Index)
// NDVI = (Near-Infrared - Red) / (Near-Infrared + Red)
var ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI');

// 4. Display the result on the map
// Green = healthy vegetation, Brown/White = bare soil/urban areas
var ndviVis = {
  min: 0.0,
  max: 1.0,
  palette: ['blue', 'white', 'green']
};

Map.addLayer(ndvi, ndviVis, 'Buea Vegetation Health (NDVI)');

// 5. Export the map as a file (to be used later in QGIS)
Export.image.toDrive({
  image: ndvi,
  description: 'Buea_NDVI_2025',
  folder: 'Green Cameroon GIS Project',
  scale: 10, // 10-meter resolution
  region: buea
});