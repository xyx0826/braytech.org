import * as utils from './utils';

export const load = async content => {

  if (!content.gear.loaded) {
    const response = await get(`https://www.bungie.net/common/destiny2_content/geometry/gear/${content.gear.filename}`);
    
    content.gear = {
      ...content.gear,
      ...response,
      loaded: true
    };
  }

  await loadContent(content);

  return content;

}

const get = async (url, arrayBuffer) => {
  const response = await fetch(url).then(async response => {

    /* This is where all of the TGX magic starts - these are basically ZIPs */
    if (arrayBuffer) {
      const arrayBuffer = await response.arrayBuffer();

      return new Uint8Array(arrayBuffer);
    } else {
      const json = await response.json();

      return json;
    }

  });

  return response;
}

const TGX = async url => {
  const data = await get(url, true);

  var magic = utils.string(data, 0x0, 0x4); // TGXM
  var version = utils.uint(data, 0x4);
  var fileOffset = utils.uint(data, 0x8);
  var fileCount = utils.uint(data, 0xC);
  var fileIdentifier = utils.string(data, 0x10, 0x100);
  //console.log(magic, version, fileOffset.toString(16), fileCount, fileIdentifier);
  if (magic != 'TGXM') {
    console.error('Invalid TGX File', url);
    return;
  }
  var files = [];
  var fileLookup = [];
  var renderMetadata = false;
  for (var f=0; f<fileCount; f++) {
    var headerOffset = fileOffset+0x110*f;
    var name = utils.string(data, headerOffset, 0x100);
    var offset = utils.uint(data, headerOffset+0x100);
    var type = utils.uint(data, headerOffset+0x104);
    var size = utils.uint(data, headerOffset+0x108);
    var fileData = data.slice(offset, offset+size);
    //console.log('file['+f+']', headerOffset.toString(16), name, offset.toString(16), size);
    if (name.indexOf('.js') != -1) { // render_metadata.js
      fileData = JSON.parse(utils.string(fileData));
      renderMetadata = fileData;
    }
    files.push({
      name: name,
      offset: offset,
      type: type,
      size: size,
      data: fileData
    });
    fileLookup.push(name);
  }
  var tgxBin = {
    url: url,
    fileIdentifier: fileIdentifier,
    files: files,
    lookup: fileLookup,
    metadata: renderMetadata
  };
  //console.log('LoadTGXBin', url);
  
  return tgxBin;
  //contentLoaded.tgxms[url.indexOf('.bin') != -1 ? 'textures' : 'geometry'][url.slice(url.lastIndexOf('/')+1).split('.')[0]] = tgxBin;
}

const loadContent = async content => {

  // determine what should be loaded i.e. male or female bits

  const filteredRegionIndexSets = [];

  if (content.indexes.dye_index_set) {
    filteredRegionIndexSets.push(content.dye_index_set);
  }

  if (content.indexes.region_index_sets) { // Use gender neutral sets
    for (var setIndex in content.indexes.region_index_sets) {
      const regionIndexSet = content.indexes.region_index_sets[setIndex];
      
      for (var j=0; j<regionIndexSet.length; j++) {
        filteredRegionIndexSets.push(regionIndexSet[j]);
      }
    }
  } else if (content.female_index_set && content.male_index_set) { // Use gender-specific set (i.e. armor)

    // filteredRegionIndexSets.push(isFemale ? content.female_index_set : content.male_index_set);
  } else {
    // This is probably a shader
  }

  // Build Asset Index Table
  var geometryIndexes = [];
  var textureIndexes = [];
  var platedTextureIndexes = [];

  for (const filteredRegionIndex in filteredRegionIndexSets) {
    const filteredRegionIndexSet = filteredRegionIndexSets[filteredRegionIndex];

    var index, i;

    if (filteredRegionIndexSet == undefined) {
      console.warn('MissingFilterRegionIndexSet', filteredRegionIndex, filteredRegionIndexSets);
      continue;
    }

    if (filteredRegionIndexSet.geometry) {
      for (i=0; i<filteredRegionIndexSet.geometry.length; i++) {
        geometryIndexes.push(filteredRegionIndexSet.geometry[i]);
      }
    }

    for (i=0; i<filteredRegionIndexSet.textures.length; i++) {
      textureIndexes.push(filteredRegionIndexSet.textures[i]);
    }

    if (filteredRegionIndexSet.shaders) {
      console.warn('AssetHasShaders['+i+']', filteredRegionIndexSet.shaders);
    }
  }

  // Remember everything for later
  const contentRegions = {
    //indexSets: filteredRegionIndexSets,
    geometry: {},
    textures: {},
    platedTextures: {},
    shaders: {}
  };

  // Load Geometry
  await Promise.all(content.tgx.geometry.map(async (geometry, i) => {
    if (geometryIndexes.indexOf(i) > -1) {
      const filename = content.tgx.geometry[i].filename;
      const tgx = await TGX(`https://www.bungie.net/common/destiny2_content/geometry/platform/mobile/geometry/${filename}`);
  
      content.tgx.geometry[i] = {
        ...content.tgx.geometry[i],
        ...tgx,
        loaded: true
      }
    }
  }));
  
  content.regions = contentRegions;

  return content;

}
