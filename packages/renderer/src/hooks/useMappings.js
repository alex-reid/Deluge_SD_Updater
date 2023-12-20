import {useEffect, useState} from 'react';

export const useMapByName = (kits, synths) => {
  const [mapByName, setMapByName] = useState({
    kits: {},
    synths: {},
  });

  useEffect(() => {
    buildSynthNameMap();
  }, [synths]);

  useEffect(() => {
    buildKitNameMap();
  }, [kits]);

  const buildSynthNameMap = () => {
    const newSynthMap = mapByName.synths;

    synths.forEach(synth => {
      if (synth.oldName && !newSynthMap[synth.oldName]) newSynthMap[synth.oldName] = {};
      newSynthMap[synth.oldName][synth.path] = {
        name: synth.rewriteName || synth.oldName,
        path: synth.path,
      };
    });

    setMapByName(prev => ({
      kits: prev.kits,
      synths: newSynthMap,
    }));
  };

  const buildKitNameMap = () => {
    const newKitMap = mapByName.kits;

    kits.forEach(kit => {
      if (kit.oldName && !newKitMap[kit.oldName]) newKitMap[kit.oldName] = {};
      newKitMap[kit.oldName][kit.path] = {name: kit.rewriteName || kit.oldName, path: kit.path};
    });

    setMapByName(prev => ({
      kits: newKitMap,
      synths: prev.synths,
    }));
  };

  return mapByName;
};
