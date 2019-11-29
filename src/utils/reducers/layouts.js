import * as ls from '../localStorage';

const lsState = ls.get('setting.layouts') ? ls.get('setting.layouts') : {};
const defaultState = {
  now: {
    groups: [
      {
        id: 'userHead',
        type: 'head',
        cols: [
          {
            id: 'userHead-col-0',
            mods: [
              {
                component: 'Flashpoint'
              }
            ]
          },
          {
            id: 'userHead-col-1',
            mods: [
              {
                component: 'DailyVanguardModifiers'
              }
            ]
          },
          {
            id: 'userHead-col-2',
            mods: [
              {
                component: 'HeroicStoryMissions'
              }
            ]
          },
          {
            id: 'userHead-col-3',
            mods: [
              {
                component: 'BlackArmoryForges'
              }
            ]
          }
        ]
      },
      {
        id: 'body-1',
        type: 'body',
        cols: [
          {
            id: 'body-1-col-0',
            mods: [
              {
                component: 'SeasonalArtifact'
              }
            ]
          },
          {
            id: 'body-1-col-1',
            mods: [
              {
                component: 'Ranks'
              }
            ]
          },
          {
            id: 'body-1-col-2',
            mods: []
          },
          {
            id: 'body-1-col-3',
            mods: []
          }
        ]
      },
      {
        id: 'body-2',
        type: 'body',
        cols: [
          {
            id: 'body-2-col-0',
            mods: [
              {
                component: 'SeasonPass'
              }
            ]
          },
          {
            id: 'body-2-col-1',
            mods: []
          },
          {
            id: 'body-2-col-2',
            mods: []
          },
          {
            id: 'body-2-col-3',
            mods: []
          }
        ]
      }
    ]
  },
  ...lsState
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_LAYOUT':
      state = {
        ...state,
        [action.payload.target]: action.payload.value
      };

      ls.set('setting.layouts', state);
      return state;
    case 'RESET_LAYOUT':
      state = {
        ...state,
        [action.payload.target]: defaultState[action.payload.target]
      };

      ls.set('setting.layouts', state);
      return state;
    default:
      return state;
  }
}
