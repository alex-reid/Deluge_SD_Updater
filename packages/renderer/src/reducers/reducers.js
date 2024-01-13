import {SUFFIX} from '../../../common/definitions';

function checkDuplicates(state) {
  const dups = new Array(state.length).fill(false);
  for (let indexA = 0; indexA < state.length; indexA++) {
    for (let indexB = indexA + 1; indexB < state.length; indexB++) {
      const compareA =
        state[indexA].rewriteName.length > 0 ? state[indexA].rewriteName : state[indexA].oldName;
      const compareB =
        state[indexB].rewriteName.length > 0 ? state[indexB].rewriteName : state[indexB].oldName;
      if (state[indexA].path + '/' + compareA == state[indexB].path + '/' + compareB) {
        dups[indexA] = true;
        dups[indexB] = true;
      }
    }
  }
  return state.map((inst, index) => ({
    ...inst,
    duplicate: dups[index],
  }));
}

export const INST = {
  LOAD_DATA: 'load',
  RENAME_SINGLE: 'rename-one',
  RENAME_ALL_V4: 'rename-v4',
  RENAME_ALL_PRETTY: 'rename-pretty',
  CHECK_DUPS: 'check_duplicates',
};

export const instrumentReducer = (state, action) => {
  switch (action.type) {
    case INST.LOAD_DATA:
      return action.payload.map(inst => ({...inst, duplicate: false}));
    case INST.RENAME_SINGLE:
      return checkDuplicates(
        state.map((old, index) => {
          if (index == action.id) {
            return {...old, rewriteName: action.value};
          }
          return old;
        }),
      );
    case INST.RENAME_ALL_V4:
      return checkDuplicates(
        state.map(old => {
          let newName = '';
          if (old.rewriteName) {
            newName = old.rewriteName;
          } else if (old.newName != old.oldName) {
            newName = old.newName;
          }
          return {
            ...old,
            rewriteName: newName,
          };
        }),
      );
    case INST.RENAME_ALL_PRETTY:
      return checkDuplicates(
        state.map(old => ({
          ...old,
          rewriteName: old.rewriteName ? old.rewriteName : old.prettyName,
        })),
      );
    case INST.CHECK_DUPS: {
      return checkDuplicates(state);
    }
    default:
      return state;
  }
};

export const SONG = {
  LOAD_DATA: 'load',
  RENAME_FROM_INST: 'rename-from-inst',
  RENAME_ALL_PRETTY: 'rename-pretty',
};

export const songReducer = (state, action) => {
  switch (action.type) {
    case SONG.LOAD_DATA:
      return action.payload;
    case SONG.RENAME_ALL_PRETTY:
      return state.map(song => ({
        ...song,
        instruments: song.instruments.map(inst => ({
          ...inst,
          rewriteName: inst.prettyName,
        })),
      }));
    case SONG.RENAME_FROM_INST:
      return state.map(song => {
        let shouldUpdate = false;
        return {
          ...song,
          instruments: song.instruments.map(inst => {
            let insts;
            if (inst.type == 'sound') insts = action.synths;
            if (inst.type == 'kit') insts = action.kits;
            const file = insts[inst.soundID];
            let newName = inst.sound.baseName + inst.sound.suffixV4;

            if (!inst.isNewSound && file.rewriteName) {
              newName = file.rewriteName;
              console.log('sound', file.sound, inst.sound);

              if (file.sound.suffixType == inst.sound.suffixType) {
                newName = file.rewriteName;
              } else if (
                file.sound.suffixType == SUFFIX.NONE &&
                inst.sound.suffixType != SUFFIX.NONE
              ) {
                newName = file.rewriteName + inst.sound.suffixV4;
              }
            }
            // if (newName != inst.sound.baseName)
            shouldUpdate = true;
            return {
              ...inst,
              rewriteName: newName,
            };
          }),
          shouldUpdate,
        };
      });
    default:
      return state;
  }
};
