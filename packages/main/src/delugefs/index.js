const fileSystem = require('./fileSystemClass');

const D = new fileSystem(
  // "/Volumes/DELUGE"
  //"./Deluge_v2",
  //"./Deluge_v4",
  './DelugeSD',
  // "/Users/alexreid/work/deluge-node/Deluge+OLED+V4p1p0+factory+card+contents",
  {
    renameToV4: true,
    prettyNames: false,
  },
);

D.init()
  .then(() => {
    D.rewriteInstrumentsToV4()
      .then(() => console.log('Sucessfully renamed Synths and Kits'))
      .catch(err => console.log('Failed remaning Synths and Kits', err));
    D.rewriteSongsToV4()
      .then(() => console.log('Sucessfully rewrote Songs'))
      .catch(err => console.log('Failed Rewriting songs', err));
  })
  .catch(err => console.error(err));
