import * as ls from '../localStorage';

const lsState = ls.get('setting.layouts') ? ls.get('setting.layouts') : {};
const defaultState = {
  now: {
    groups: [
      {
        id: 'head',
        type: 'head',
        cols: [
          {
            id: 'head-col-0',
            mods: [
              {
                id: 'Flashpoint-0',
                component: 'Flashpoint'
              }
            ]
          },
          {
            id: 'head-col-1',
            mods: [
              {
                id: 'DailyVanguardModifiers-0',
                component: 'DailyVanguardModifiers'
              }
            ]
          },
          {
            id: 'head-col-2',
            mods: [
              {
                id: 'HeroicStoryMissions-0',
                component: 'HeroicStoryMissions'
              }
            ]
          },
          {
            id: 'head-col-3',
            mods: [
              {
                id: 'BlackArmoryForges-0',
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
                id: 'SeasonalArtifact-0',
                component: 'SeasonalArtifact'
              }
            ]
          },
          {
            id: 'body-1-col-1',
            mods: [
              {
                id: 'Ranks-0',
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
                id: 'SeasonPass-0',
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
  }
};

export default function reducer(state = {...defaultState, ...lsState}, action) {
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
