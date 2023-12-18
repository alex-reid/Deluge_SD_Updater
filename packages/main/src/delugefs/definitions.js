const letterToIndexMap = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
  i: 8,
  j: 9,
  k: 10,
  l: 11,
  m: 12,
  n: 13,
  o: 14,
  p: 15,
  q: 16,
  r: 17,
  s: 18,
  t: 19,
  u: 20,
  v: 21,
  w: 22,
  x: 23,
  y: 24,
  z: 25,
};

const indexToLetterMap = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const newNames = {
  SYNTHS: [
    '000 Rich Saw Bass',
    '001 Sync Bass',
    '002 Basic Square Bass',
    '003 Synthwave Bass',
    '004 Dubby Bass',
    '005 Sweet Mono Bass',
    '006 Vaporwave Bass',
    '007 Detuned Saw Bass',
    '008 FM Rich Distorted Bass',
    '009 Hoover Bass',
    '010 Gravel Basscamp',
    '011 Dubstep Bass',
    '012 Blunt Sync Bass',
    '013 Trap Bass 1',
    '014 Trap Bass 2',
    '015 Resonant Filter Bass',
    '016 Dark Saturated Bass',
    '017 Impact Saw Lead',
    '018 Rich Saw Lead',
    '019 Fizzy Strings',
    '020 Soft Saw Lead',
    '021 80s TV Lead',
    '022 Rich Filter LFO Lead',
    '023 Analog Mono Wow',
    '024 Warble Bass Pluck',
    '025 Soft Synth Organ',
    '026 PW Organ',
    '027 PW Envelope',
    '028 PWM',
    '029 Chiptune Trill',
    '030 Distant Porta',
    '031 Nasal Choir',
    '032 Bandpass Choir',
    '033 Rich Square',
    '034 Square Choir',
    '035 Bell Lead & Bass',
    '036 Analog Ambient Square',
    '037 Echo Chord',
    '038 Vapor Arp',
    '039 Detuned Retriggering Saws',
    '040 Spacer Leader',
    '041 Zithar - Vibed',
    '042 High Triangle',
    '043 Square Porta',
    '044 8-Bit Lead',
    '045 Square Sync',
    '046 Saw Sync',
    '047 Basic Dirty Bass',
    '048 Thin Pulse Bass',
    '049 Basic FM',
    '050 FM Basic Bass',
    '051 FM Rich Brass',
    '052 Soft FM',
    '053 Detuned FM Horns',
    '054 Ghostly Sines',
    '055 FM Theremin',
    '056 FM Bell Modulation',
    '057 FM Lead',
    '058 FM Rising Attack',
    '059 Distorted Lead Guitar',
    '060 Bass Guitar',
    '061 Blown-Staccato-Panpipes',
    '062 Trumpet',
    '063 Tuba',
    '064 Reeds-Flute-Oboe',
    '065 Cello',
    '066 Violin',
    '067 Marimba',
    '068 FM Bells 1',
    '069 FM Bells 2',
    '070 Glockenspiel',
    '071 Rhodes',
    '072 Kyoto Phono',
    '073 Piano',
    '074 Electric Piano',
    '075 Electric Piano With Strings',
    '076 Organ',
    '077 FM Perc-Organ',
    '078 House',
    '079 Phased Arper',
    '080 House',
    '081 Xylophone Big Bass',
    '082 Short Sharp Delay',
    '083 Dark Chorus',
    '084 FM Narrow Band',
    '085 Deep Fizz',
    '086 Techno Organ',
    '087 Define Leader',
    '088 Yelp Chords',
    '089 Degraded Retro Lead',
    '090 FM Organ',
    '091 FM Ricochet',
    '092 Degraded Tremolo',
    '093 FM Distorted Bells',
    '094 Ambient Occlusion Lead',
    '095 Harsh FM Feedback',
    '096 FM Guitar Power Chord',
    '097 Saturated Filter',
    '098 Saturated Sync',
    '099 Overdrive Reese Sync',
    '100 Noise Lead',
    '101 Atebit',
    '102 Harsh 5th',
    '103 Sci-fi Chaos',
    '104 Alien Vomit',
    '105 Attack Bass',
    '106 Hang Drum',
    '107 FM LPG Percussion',
    '108 Robo Arp',
    '109 Talking Arp',
    '110 Crystalline Ringmod',
    '111 Satellite Drum',
    '112 Hard Tech Beat',
    '113 Bio Lab',
    '114 Sootheerio',
    '115 Sounds After Take-off',
    '116 Evolving Frequencies',
    '117 Belledy',
    '118 Small Bridge Pad',
    '119 Stars Of The Bin Pad',
    '120 High Harsh Pad',
    '121 Tiny Lights',
    '122 Majestic Synth Orchestra',
    '123 Space Dust',
    '124 Filter Modulation Pad',
    '125 Evolving Pad',
    '126 Dark FM Pad',
    '127 Alien Larvae',
    '128 Lunar Landing',
    '129 Sci-fi Scenic',
    '130 Dark Strings',
    '131 Warm Strings',
    '132 Organ Strings',
    '133 80s Strings',
    '134 Melody String',
    '135 Soothing Growth Pad',
    '136 Synthwave Pad',
    '137 Epic Saw Modulation Pad',
    '138 Brassy Pad',
    '139 Detuned Saw Pad',
    '140 Slow Aural Swells',
    '141 Ringmod Pad',
    '142 Phaser',
    '143 Chillout Pad',
    '144 Sweep Chords',
    '145 Eerie High Pad',
    '146 Atmospheric Squares Pad',
    '147 Resonant Filter Pad',
    '148 Warm 5th Pad',
    '149 Cold 5th Pad',
    '150 Vaporwave Pad',
    '151 Radiant FM Pad',
    '152 Small Jet Pad',
    '153 FM Modulation Pad',
    '154 Rich FM Pad 1',
    '155 Rich FM Pad 2',
    '156 Rich FM Pad 3',
    '157 Rich FM Pad 4',
    '158 Tempo-Synced LFO',
    '159 80s Bass Rhythm',
    '160 Synthwave Bass Arp',
    '161 Synthwave Vibrato Arp',
    '162 Busy Arp',
    '163 Crisp Pop Arp',
    '164 Study Arp',
    '165 Acid Arp',
    '166 Harpsichord Cyborg',
    '167 FM Metallic Bass Arp',
    '168 Hang Drum',
    '169 Double Bass',
    '170 Sitar',
  ],
  KITS: [
    '000 TR-808',
    '001 DDD-1',
    '002 SDS-5',
    '003 TR-909',
    '004 R-50',
    '005 R-100',
    '006 LD',
    '007 HR-16B',
    '008 SCDT',
    '009 RX-5',
    '010 XV-5080',
    '011 KR-55',
    '012 HR-II',
    '013 AT Rhythm',
    '014 CR-78',
    '015 Andrew Stirton Frugal',
    '016 Electronisounds 1',
    '017 Electronisounds 2',
    '018 Electronisounds 3',
    '019 Fairburg',
    '020 Leonard Ludvigsen Beatbox',
    '021 hodeur 1',
    '022 hodeur 2',
    '023 hodeur 3',
    '024 James R Closs 1',
    '025 James R Closs 2',
    '026 Amiga909',
    '027 Reciprocal Sound',
    '028 Danny Taurus',
    '029 Danny Taurus 2',
    '030 Chaz Bundick',
    '031 Reuben Winter',
    '032 Kody Nielson',
    '033 Alfred Darlington',
    '034 Travis Egedy',
    '035 Sjionel Timu',
    '036 Stefanie Franciotti',
    '037 Stephanie Engelbrecht',
    '038 Jonathan Snipes (FX)',
    '039 Campbell Kneale',
    '040 John Atkinson',
    '041 Jonathan Snipes (Waterfalls)',
    '042 Phil Elverum',
  ],
};

const typeMappings = [
  {
    type: 'synths',
    folder: 'SYNTHS',
    xml: 'sound',
    file: 'SYNT',
    pretty: 'Synth',
  },
  {type: 'kits', folder: 'KITS', xml: 'kit', file: 'KIT', pretty: 'Kit'},
  {type: 'songs', folder: 'SONGS', xml: 'song', file: 'SONG', pretty: 'Song'},
];

export {letterToIndexMap, indexToLetterMap, newNames, typeMappings};
