import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { ProfileLink } from '../../../components/ProfileLink';
import { Button, DestinyKey } from '../../../components/UI/Button';
import Checkbox from '../../../components/UI/Checkbox';

import './styles.css';

// reorders a list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// moves an item from one list to another list
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  if (moduleRules.full.includes(removed.component) || moduleRules.double.includes(removed.component)) {
    destClone.splice(0, destClone.length, removed);
  } else {
    destClone.splice(droppableDestination.index, 0, removed);
  }

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

// adds an item to a list
const add = (destination, item) => {
  // if a mod is "full" or "double", it occupies the entire column, erasing previous mods... mostly because i said so
  const result = moduleRules.full.includes(item.component) || moduleRules.double.includes(item.component) ? [item] : [...destination, item];

  return result;
};

// removes an item from a list
const remove = (destination, item) => {
  const result = [...destination].filter(i => i.id !== item.id);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer

  // change background colour if dragging
  background: isDragging ? 'rgba(255, 255, 255, 0.4)' : '',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'rgba(255, 255, 255, 0.2)' : ''
});

export const moduleRules = {
  full: ['SeasonPass'],
  double: ['SeasonalArtifact'],
  head: ['Flashpoint', 'DailyVanguardModifiers', 'HeroicStoryMissions', 'BlackArmoryForges']
};

class Customise extends React.Component {
  state = this.props.layout;

  getList = id => {
    const group = this.state.groups.find(g => g.cols.find(c => c.id === id));
    const col = group.cols.find(c => c.id === id);

    return {
      group,
      col
    };
  };

  onDragEnd = result => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList = this.getList(source.droppableId);
    const destinationList = this.getList(destination.droppableId);

    // prevents modules being added or moved to groups with "full" modules i.e. SeasonPass
    //if (sourceList.col.mods.find(m => moduleRules.full.includes(m.component))) return;
    if (destinationList.group.cols.filter(c => c.mods.filter(m => moduleRules.full.filter(f => f === m.component).length).length).length) return;

    // if reordering a list (column), else list to list
    if (source.droppableId === destination.droppableId) {
      const result = reorder(sourceList.col.mods, source.index, destination.index);

      this.setState(p => {
        const groups = p.groups;

        const group = groups.find(g => g.id === sourceList.group.id);

        if (group) {
          const index = group.cols.findIndex(c => c.id === sourceList.col.id);

          if (index > -1) {
            group.cols[index].mods = result;
          }
        }

        return {
          ...p,
          groups
        };
      });
    } else {
      // enforces 1 module limit on header group
      if (destinationList.col.mods.length && destinationList.group.id === 'head') return;
      // no full or double mods in header group
      if (sourceList.col.mods.find(m => moduleRules.full.includes(m.component) || moduleRules.double.includes(m.component)) && destinationList.group.id === 'head') return;
      // permit only approved mods to head
      if (!moduleRules.head.includes(sourceList.col.mods[source.index].component) && destinationList.group.id === 'head') return;
      // force full mods to first column
      if (sourceList.col.mods.find(m => moduleRules.full.includes(m.component))) {
        destination.droppableId = destinationList.group.cols[0].id;
      }
      // force double mods to third or less column
      if (sourceList.col.mods.find(m => moduleRules.double.includes(m.component))) {
        // find intended insertion index
        const index = destinationList.group.cols.findIndex(c => c.id === destinationList.col.id);
        // make sure index is less than 3 (4th column) as the mod occupies 2 columns
        const ratifiedIndex = Math.min(index, 2);

        destination.droppableId = destinationList.group.cols[ratifiedIndex].id;
      }

      const result = move(sourceList.col.mods, destinationList.col.mods, source, destination);

      this.setState(p => {
        const groups = p.groups;

        const sourceGroup = groups.find(g => g.id === sourceList.group.id);

        // apply changes to source list
        if (sourceGroup) {
          Object.keys(result).forEach(id => {
            const index = sourceGroup.cols.findIndex(c => c.id === id);

            if (index > -1) {
              sourceGroup.cols[index].mods = result[id];
            }
          });
        }

        // apply changes to destination list
        const destinationGroup = groups.find(g => g.id === destinationList.group.id);

        if (destinationGroup) {
          Object.keys(result).forEach(id => {
            const index = destinationGroup.cols.findIndex(c => c.id === id);

            if (index > -1) {
              destinationGroup.cols[index].mods = result[id];
            }
          });
        }

        return {
          ...p,
          groups
        };
      });
    }
  };

  handler_addGroup = e => {
    this.setState(p => {
      const groupId = this.state.groups.filter(g => g.type === 'body').length + 1;
      const group = {
        id: `body-${groupId}`,
        type: 'body',
        cols: [
          {
            id: `body-${groupId}-col-0`,
            mods: []
          },
          {
            id: `body-${groupId}-col-1`,
            mods: []
          },
          {
            id: `body-${groupId}-col-2`,
            mods: []
          },
          {
            id: `body-${groupId}-col-3`,
            mods: []
          }
        ]
      };

      return {
        ...p,
        groups: [...p.groups, group]
      };
    });
  };

  handler_removeGroup = id => e => {
    this.setState(p => {
      return {
        ...p,
        groups: p.groups.filter(g => g.id !== id)
      };
    });
  };

  handler_addMod = (groupId, key) => {
    const destinationList = this.getList(groupId);

    if (!destinationList) {
      console.warn(`Could not find a destinationList for: ${groupId}, ${key}`);
      return;
    }

    const id = `${key}-${destinationList.col.mods.filter(m => m.component === key).length}`;

    const result = add(destinationList.col.mods, { id, component: key });

    this.setState(p => {
      const groups = p.groups;

      const group = groups.find(g => g.id === destinationList.group.id);

      if (group && moduleRules.full.includes(key)) {
        group.cols[0].mods = result;
      } else if (group && moduleRules.double.includes(key)) {
        // find intended insertion index
        const index = group.cols.findIndex(c => c.id === destinationList.col.id);
        // make sure index is less than 3 (4th column) as the mod occupies 2 columns
        const ratifiedIndex = Math.min(index, 2);

        group.cols[ratifiedIndex].mods = result;
      } else if (group) {
        const index = group.cols.findIndex(c => c.id === destinationList.col.id);

        if (index > -1) {
          group.cols[index].mods = result;
        }
      }

      return {
        ...p,
        groups
      };
    });
  };

  handler_removeMod = (groupId, id) => e => {
    const destinationList = this.getList(groupId);

    const result = remove(destinationList.col.mods, { id });

    this.setState(p => {
      const groups = p.groups;

      const group = groups.find(g => g.id === destinationList.group.id);

      if (group) {
        const index = group.cols.findIndex(c => c.id === destinationList.col.id);

        if (index > -1) {
          group.cols[index].mods = result;
        }
      }

      return {
        ...p,
        groups
      };
    });
  };

  handler_setSettings = (col, mod, value) => {
    const destinationList = this.getList(col);

    this.setState(p => {
      const groups = p.groups;

      const group = groups.find(g => g.id === destinationList.group.id);

      if (group) {
        const colIndex = group.cols.findIndex(c => c.id === destinationList.col.id);
        const modIndex = colIndex > -1 && group.cols[colIndex].mods.findIndex(m => m.id === mod);

        if (modIndex > -1) {
          group.cols[colIndex].mods[modIndex].settings = [
            //...group.cols[colIndex].settings || [],
            value
          ];
        }
      }

      return {
        ...p,
        groups
      };
    });
  };

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {
    if (s !== this.state) {
      this.props.setLayout(this.state);
    }
  }

  modules = {
    Flashpoint: {
      name: manifest.DestinyMilestoneDefinition[463010297] && manifest.DestinyMilestoneDefinition[463010297].displayProperties && manifest.DestinyMilestoneDefinition[463010297].displayProperties.name,
      description: manifest.DestinyMilestoneDefinition[463010297] && manifest.DestinyMilestoneDefinition[463010297].displayProperties && manifest.DestinyMilestoneDefinition[463010297].displayProperties.description
    },
    DailyVanguardModifiers: {
      name: this.props.t('Vanguard Ops'),
      description: this.props.t('Active modifiers for Vanguard operations')
    },
    HeroicStoryMissions: {
      name: manifest.DestinyPresentationNodeDefinition[3028486709] && manifest.DestinyPresentationNodeDefinition[3028486709].displayProperties && manifest.DestinyPresentationNodeDefinition[3028486709].displayProperties.name,
      description: this.props.t('Revisit the trials of times past. Reconcile with these emotions and challenge yourself to do better.')
    },
    BlackArmoryForges: {
      name: this.props.t('Black Armory Forges'),
      description: this.props.t('Forges are currently running in low-power mode and will only be available during maintenance periods.')
    },
    Ranks: {
      name: this.props.t('Ranks'),
      description: this.props.t('Competive multiplayer progression information')
    },
    Vendor: {
      name: this.props.t('Vendor'),
      description: this.props.t('Status and inventory for vendors'),
      limit: 4,
      settings: [
        {
          id: 'vendorHash',
          name: this.props.t('Selected vendor'),
          options: {
            name: hash => manifest.DestinyVendorDefinition[hash] && manifest.DestinyVendorDefinition[hash].displayProperties && manifest.DestinyVendorDefinition[hash].displayProperties.name,
            values: [2917531897, 672118013, 3603221665, 863940356, 248695599, 69482069]
          }
        }
      ]
    },
    SeasonalArtifact: {
      name: this.props.t('Seasonal progression'),
      description: this.props.t("Display your seaonal artifact's configuration and its progression")
    },
    SeasonPass: {
      name: this.props.t('Season rank'),
      description: this.props.t('Display your season pass progression and available rewards')
    },
    CharacterEquipment: {
      name: this.props.t('Character equipment'),
      description: this.props.t('Display your season pass progression and available rewards')
    }
  };

  inUse = key => {
    const limit = this.modules[key].limit || 1;

    const instances = this.state.groups.reduce((a, g) => {
      return a + g.cols.reduce((a, c) => {
        return a + c.mods.filter(m => m.component === key).length;
      }, 0);
    }, 0);

    return {
      used: instances >= limit,
      instances,
      limit
    };
  };

  render() {
    const { t } = this.props;

    // mark used modules
    Object.keys(this.modules).forEach(key => {
      const { used, instances } = this.inUse(key);

      this.modules[key].used = used;
      this.modules[key].instances = instances;
    });

    return (
      <>
        <div className='groups'>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {this.state.groups.map((group, i) => {
              const modFullSpan = group.cols.findIndex(c => c.mods.find(m => moduleRules.full.includes(m.component)));
              const modDoubleSpan = group.cols.findIndex(c => c.mods.find(m => moduleRules.double.includes(m.component)));

              const cols = modFullSpan > -1 ? group.cols.slice(0, 1) : modDoubleSpan > -1 ? group.cols.slice(0, 3) : group.cols;

              return (
                <div key={i} className={cx('group', 'user', { head: group.id === 'head', full: modFullSpan > -1 })}>
                  {cols.map((col, i) => {
                    const columnFilled = group.id === 'head' && col.mods.length;

                    return (
                      <div key={col.id} className={cx('column', { double: i === modDoubleSpan })}>
                        <div className='col-id'>{col.id}</div>
                        <Droppable droppableId={col.id}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} className='column-inner'>
                              {col.mods.map((mod, i) => {
                                const { name, description } = this.modules[mod.component];

                                const settings =
                                  (this.modules[mod.component].settings &&
                                    this.modules[mod.component].settings.map(setting => ({
                                      ...setting,
                                      options: {
                                        ...setting.options,
                                        value: mod.settings && mod.settings.find(u => u.id === setting.id) && mod.settings.find(u => u.id === setting.id).value
                                      }
                                    }))) ||
                                  false;

                                return (
                                  <Draggable key={mod.id} draggableId={mod.id} index={i}>
                                    {(provided, snapshot) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)} className='module button'>
                                        <div className='text'>
                                          <div className='name'>{name}</div>
                                          <div className='description'>{description}</div>
                                        </div>
                                        {settings ? <ModulesSettings settings={settings} column={col.id} mod={mod.id} setSettings={this.handler_setSettings} /> : null}
                                        <Button className='remove' onClick={this.handler_removeMod(col.id, mod.id)}>
                                          <i className='segoe-uniE1061' />
                                        </Button>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <ModulesSelector disabled={columnFilled || modFullSpan > -1} modules={this.modules} groupType={group.type} column={col.id} addMod={this.handler_addMod} />
                      </div>
                    );
                  })}
                  {group.id === 'head' ? null : <Button className='remove row' text={t('Remove group')} onClick={this.handler_removeGroup(group.id)} />}
                </div>
              );
            })}
          </DragDropContext>
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>
                <Button onClick={this.handler_addGroup}>
                  <DestinyKey type='accept' />
                  {t('Add a group')}
                </Button>
              </li>
              <li>
                <ProfileLink className='button' to='/now'>
                  <DestinyKey type='dismiss' />
                  {t('Back')}
                </ProfileLink>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

class ModulesSelector extends React.Component {
  state = {
    expanded: false
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_expand = e => {
    if (this.mounted) this.setState({ expanded: true });
  };

  handler_compress = e => {
    if (this.mounted) this.setState({ expanded: false });
  };

  handler_select = key => e => {
    if (this.mounted) {
      this.props.addMod(this.props.column, key);
      this.setState({ expanded: false });
    }
  };

  render() {
    const { t, disabled, modules, groupType } = this.props;
    const { expanded } = this.state;

    if (!disabled && expanded) {
      return (
        <div className='modules-selector expanded'>
          <Button text={t('Cancel')} onClick={this.handler_compress} />
          <div className='list'>
            {Object.keys(modules).map(key => {
              const { name, description, used, limit, instances } = modules[key];

              const unavailable = groupType === 'head' && !moduleRules.head.includes(key);

              if (unavailable) return null;

              return (
                <div key={key} className={cx('module', 'button', { disabled: used || unavailable })} onClick={!used ? this.handler_select(key) : undefined}>
                  <div className='text'>
                    <div className='name'>{name}</div>
                    {limit > 1 ? <div className='limit'>{instances}/{limit}</div> : null}
                    <div className='description'>{description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className='modules-selector'>
          <Button text={t('Add a module')} disabled={disabled} onClick={this.handler_expand} />
        </div>
      );
    }
  }
}

class ModulesSettings extends React.Component {
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_optionsSelect = payload => e => {
    if (this.mounted) {
      this.props.setSettings(this.props.column, this.props.mod, payload);
    }
  };

  render() {
    const { settings } = this.props;

    return (
      <div className='modules-settings'>
        {settings.map((setting, s) => (
          <div key={s} className='setting'>
            <div className='name'>{setting.name}</div>
            <ul className='list settings'>
              {setting.options.values.map((value, v) => {
                const id = setting.id;
                const name = setting.options.name(value);
                const checked = setting.options.multi ? setting.options.value.includes(value) : setting.options.value === value;

                return (
                  <li key={v} onClick={this.handler_optionsSelect({ id, value })}>
                    <Checkbox linked checked={checked} text={name} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

ModulesSelector = compose(withTranslation())(ModulesSelector);

ModulesSettings = compose(withTranslation())(ModulesSettings);

function mapStateToProps(state, ownProps) {
  return {
    layout: state.layouts.now
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLayout: value => {
      dispatch({
        type: 'SET_LAYOUT',
        payload: {
          target: 'now',
          value
        }
      });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Customise);
