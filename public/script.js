if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}

function ready() {
  const roleListSubmit = document.getElementById('roleListSubmit');
  const playerListSubmit = document.getElementById('playerListSubmit');
  roleListSubmit.addEventListener('click', submitRoleList);
  document.getElementById('autofillButton').addEventListener('click', autoFill);

  let collisionColors = [];
  let collisions = [];

  let avoidGameRole = [];

  const gameRoleList = {
    gameRole1: [],
    gameRole2: [],
    gameRole3: [],
    gameRole4: [],
    gameRole5: [],
    gameRole6: [],
    gameRole7: [],
    gameRole8: [],
    gameRole9: [],
    gameRole10: [],
    gameRole11: [],
    gameRole12: [],
    gameRole13: [],
    gameRole14: [],
    gameRole15: []
  };

  let checkboxRolesAvoid = {
    checkbox1: [],
    checkbox2: [],
    checkbox3: [],
    checkbox4: [],
    checkbox5: [],
    checkbox6: [],
    checkbox7: [],
    checkbox8: [],
    checkbox9: [],
    checkbox10: [],
    checkbox11: [],
    checkbox12: [],
    checkbox13: [],
    checkbox14: [],
    checkbox15: []
  };

  const checkboxRoles = {
    'any random': { values: ['any killing', 'mafia random', 'town random',
                            'neutral random', 'triad random'],
                    roles: ['Kill', 'Mafia', 'Town', 'Neutral', 'Triad']
                  },
    'town random': { values: ['town killing', 'town government', 'town investigative',
                              'town protective', 'town power'],
                     roles: ['Kill', 'Gov', 'Invest', 'Prot', 'Power']
                   },
    'town government': { values: ['citizen', 'mayor', 'mayor',
                                  'mason leader', 'crier'],
                         roles: ['Cit', 'Mas', 'Mayor/Marsh', 'ML', 'Crier']
                       },
    'town investigative': { values: ['coroner', 'sheriff', 'investigator',
                                     'detective', 'lookout'],
                            roles: ['Coro', 'Sher', 'Invest', 'Det', 'LO']
                          },
    'town protective': { values: ['bus driver', 'bodyguard', 'doctor', 'escort'],
                         roles: ['BD', 'BG', 'Doc', 'Escort']
                       },
    'town killing': { values: ['veteran', 'jailor', 'bodyguard', 'vigilante'],
                      roles: ['Vet', 'Jail', 'BG', 'Vig']
                    },
    'town power': { values: ['veteran', 'spy', 'bus driver', 'jailor'],
                    roles: ['Vet', 'Spy', 'BD', 'Jail']
                  },
    'mafia random': { values: ['mafia killing'],
                      roles: ['Kill']
                    },
    'mafia killing': { values: ['disguiser', 'kidnapper', 'mafia', 'godfather'],
                       roles: ['Disg', 'Kidnap', 'Maf', 'GF']
                     },
    'mafia support': { values: ['blackmailer', 'kidnapper', 'consort',
                                'consigilere', 'agent'],
                       roles: ['BM', 'Kidnap', 'Consort', 'Consig', 'Agent']
                     },
    'mafia deception': { values: ['disguiser', 'framer', 'janitor', 'beguiler'],
                         roles: ['Disg', 'Frame', 'Jani', 'Begu']
                       },
    'triad random': { values: ['triad killing'],
                      roles: ['Kill']
                    },
    'triad killing': { values: ['informant', 'interrogator', 'enforcer',
                                'dragon head'],
                       roles: ['Info', 'Inter', 'Enfor', 'DH']
                     },
    'triad support': { values: ['silencer', 'interrogator', 'liasion',
                                'administrator', 'vanguard'],
                       roles: ['Sile', 'Inter', 'Liais', 'Admin', 'Van']
                     },
    'triad deception': { values: ['informant', 'forger', 'incense master',
                                  'deceiver'],
                         roles: ['Info', 'Forg', 'Incen', 'Decei']
                       },
    'neutral random': { values: ['neutral killing', 'neutral evil',
                                 'neutral benign'],
                        roles: ['Kill', 'Evil', 'Benign']
                      },
    'neutral killing': { values: ['serial killer', 'arsonist', 'mass murderer'],
                         roles: ['SK', 'Arso', 'MM']
                       },
    'neutral evil': { values: ['neutral killing', 'cultist', 'judge',
                               'witch', 'auditor'],
                      roles: ['Kill', 'Cult', 'Judg', 'Witc', 'Audi']
                    },
    'neutral benign': { values: ['survivor', 'jester', 'executioner', 'amnesiac'],
                        roles: ['Surv', 'Jest', 'Exec', 'Amne']
                      },
  }

  const playerRoleList = {
    playerRole1: '',
    playerRole2: '',
    playerRole3: '',
    playerRole4: '',
    playerRole5: '',
    playerRole6: '',
    playerRole7: '',
    playerRole8: '',
    playerRole9: '',
    playerRole10: '',
    playerRole11: '',
    playerRole12: '',
    playerRole13: '',
    playerRole14: '',
    playerRole15: ''
  };

  const roleMatches = {
    playerRole1: [],
    playerRole2: [],
    playerRole3: [],
    playerRole4: [],
    playerRole5: [],
    playerRole6: [],
    playerRole7: [],
    playerRole8: [],
    playerRole9: [],
    playerRole10: [],
    playerRole11: [],
    playerRole12: [],
    playerRole13: [],
    playerRole14: [],
    playerRole15: []
  };

  const containers = {
    gameRole1: '',
    gameRole2: '',
    gameRole3: '',
    gameRole4: '',
    gameRole5: '',
    gameRole6: '',
    gameRole7: '',
    gameRole8: '',
    gameRole9: '',
    gameRole10: '',
    gameRole11: '',
    gameRole12: '',
    gameRole13: '',
    gameRole14: '',
    gameRole15: ''
  };

  const rolesArray = ['bodyguard', 'bus driver', 'citizen', 'coroner', 'crier',
                      'detective', 'doctor', 'escort', 'investigator', 'jailor',
                      'lookout', 'marshall', 'mason', 'mason leader', 'mayor',
                      'sheriff', 'spy', 'veteran', 'vigilante', 'agent',
                      'beguiler', 'blackmailer', 'consigilere', 'consort',
                      'disguiser', 'framer', 'godfather', 'janitor', 'kidnapper', 
                      'mafioso', 'administrator', 'deceiver', 'dragon head', 'enforcer',
                      'forger', 'incense master', 'informant', 'interrogator', 'liaison',
                      'silencer','vanguard', 'amnesiac', 'arsonist', 'auditor',
                      'cultist', 'executioner', 'jester', 'judge', 'mass murderer', 
                      'serial killer', 'survivor', 'witch', 'witch doctor'
                      ];
  
  const roleCategories = {

    'any random': rolesArray,

    'any killing': ['bodyguard', 'jailor', 'veteran', 'vigilante', 'disguiser',
                    'godfather', 'kidnapper', 'mafioso', 'dragon head', 'enforcer',
                    'informant', 'interrogator', 'arsonist', 'mass mudrerer', 'serial killer'],

    'town random': ['bodyguard', 'bus driver', 'citizen', 'coroner', 'crier',
                     'detective', 'doctor', 'escort', 'investigator', 'jailor',
                     'lookout', 'marshall', 'mason', 'mason leader', 'mayor',
                     'sheriff', 'spy', 'veteran', 'vigilante'],

    'town government': ['citizen', 'crier', 'marshall', 'mason', 'mason leader', 
                         'mayor'],

    'town investigative': ['coroner', 'detective', 'investigator', 'lookout', 'sheriff'],

    'town protective': ['bodyguard', 'bus driver', 'doctor', 'escort'],

    'town killing': ['bodyguard', 'jailor', 'veteran', 'vigilante'],

    'town power': ['bus driver', 'jailor', 'spy', 'veteran'],

    'mafia random': ['agent', 'beguiler', 'blackmailer', 'consigilere', 'consort',
                     'disguiser', 'framer', 'godfather', 'janitor', 'kidnapper', 
                     'mafioso'],

    'mafia killing': ['disguiser', 'godfather', 'kidnapper', 'mafioso'],

    'mafia support': ['agent', 'blackmailer', 'consigilere', 'consort', 'kidnapper'],

    'mafia deception': ['beguiler', 'disguiser', 'framer', 'janitor'],

    'triad random': ['administrator', 'deceiver', 'dragon head', 'enforcer', 'forger',
                     'incense master', 'informant', 'interrogator', 'liaison', 'silencer',
                     'vanguard'],

    'triad killing': ['dragon head', 'enforcer', 'informant', 'interrogator'],

    'triad support': ['administrator', 'interrogator', 'liaison', 'silencer', 'vanguard'],

    'triad deception': ['deceiver', 'forger', 'incense master', 'informant'],

    'neutral random': ['amnesiac', 'arsonist', 'auditor', 'cultist', 'executioner',
                       'jester', 'judge', 'mass murderer', 'serial killer', 'survivor',
                       'witch', 'witch doctor'],

    'neutral killing': ['arsonist', 'mass murderer', 'serial killer'],

    'neutral evil': ['arsonist', 'auditor', 'cultist', 'judge', 'mass murderer',
                     'serial killer', 'witch', 'witch doctor'],

    'neutral benign': ['amnesiac', 'executioner', 'jester', 'survivor'],

    'bodyguard': ['bodyguard'], 
    'bus driver': ['bus driver'], 
    'citizen': ['citizen'], 
    'coroner': ['coroner'], 
    'crier': ['crier'],
    'detective': ['detective'], 
    'doctor': ['doctor'], 
    'escort': ['escort'], 
    'investigator': ['investigator'],
    'jailor': ['jailor'],
    'lookout': ['lookout'], 
    'marshall': ['marshall'], 
    'mason': ['mason'], 
    'mason leader': ['mason leader'], 
    'mayor': ['mayor'],
    'sheriff': ['sheriff'], 
    'spy': ['spy'], 
    'veteran': ['veteran'], 
    'vigilante': ['vigilante'],
    'agent': ['agent'],
    'beguiler': ['beguiler'], 
    'blackmailer': ['blackmailer'], 
    'consigilere': ['consigilere'],
    'consort': ['consort'],
    'disguiser': ['disguiser'], 
    'framer': ['framer'], 
    'godfather': ['godfather'], 
    'janitor': ['janitor'], 
    'kidnapper': ['kidnapper'], 
    'mafioso': ['mafioso'], 
    'administrator': ['administrator'], 
    'deceiver': ['deceiver'],
    'dragon head': ['dragon head'],
    'enforcer': ['enforcer'],
    'forger': ['forger'],
    'incense master': ['incense master'],
    'informant': ['informant'], 
    'interrogator': ['iterrogator'], 
    'liaison': ['liaison'],
    'silencer': ['silencer'],
    'vanguard': ['vanguard'], 
    'amnesiac': ['amnesiac'],
    'arsonist': ['arsonist'], 
    'auditor': ['auditor'],
    'cultist': ['cultist'], 
    'executioner': ['executioner'], 
    'jester': ['jester'], 
    'judge': ['judge'], 
    'mass murderer': ['mass murderer'], 
    'serial killer': ['serial killer'], 
    'survivor': ['survivor'], 
    'witch': ['witch'], 
    'witch doctor': ['witch']
  };

  function submitRoleList() {
    const roleListDOM = document.getElementsByClassName('roleList');
    let roleList = [];

    for (let i = 0; i < roleListDOM.length; i++) {
      // reset anything done by focusError()
      roleListDOM[i].style.color = 'black';
      let input = roleListDOM[i].value.toLowerCase();
      roleList[i] = input;
    }
    if (!verifyList(roleList, roleListDOM, roleCategories)) {
      return;
    }

    assignRoles(roleList);
    playerListSubmit.addEventListener('click', submitPlayerList);
  }

  // game categories change into respective game roles
  function assignRoles(roleList) {
    for (let i in gameRoleList) {
      gameRoleList[i] = [];
    }
    checkboxRolesAssign();

    const gameRoles = Object.keys(gameRoleList);
    const checkboxKeys = Object.keys(checkboxRolesAvoid);

    for (let i = 0; i < roleList.length; i++) {
      for (let j in roleCategories) {
        if (roleList[i] === j) {
          let roles = roleCategories[j];
          for (let k = 0; k < roles.length; k++) {
            let gameRole = gameRoles[i];
            let checkboxKey = checkboxKeys[i];
            let role = roles[k];
            if (!checkboxRolesAvoid[checkboxKey].includes(role)) {
              gameRoleList[gameRole].push(role);
            }
          }
          break;
        }
      }
    }
  }
  
  // fill the checkbox array of roles to avoid
  function checkboxRolesAssign() {
    for (let i in checkboxRolesAvoid) {
      checkboxRolesAvoid[i] = [];
    }

    let checkboxes = document.getElementsByClassName('checkboxClass');
    const checkboxKeys = Object.keys(checkboxRolesAvoid);

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        let index = Math.floor(i/5);
        let checkboxKey = checkboxKeys[index];
        let roleCategoriesKey = checkboxes[i].value;
        let roles = roleCategories[roleCategoriesKey];

        checkboxRolesAvoid[checkboxKey] = checkboxRolesAvoid[checkboxKey].concat(roles);
      }
    }
  }

  // verifies that input is acceptable text
  function verifyList(list, listDOM, checkArray) {
    if (checkArray === roleCategories) {
      checkArray = Object.keys(roleCategories);
    }
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < checkArray.length; j++) {
        if (list[i] === '' || list[i] === checkArray[j]) {
          break;
        } else if (j === checkArray.length-1) {
          focusError(i, listDOM);
          return false;
        }
      }
    }
    return true;
  }

  // focuses on spelling errors
  function focusError(index, list) {
    list[index].focus();
    list[index].style.color = 'red';
    list[index].value = 'Invalid Role';
  }

  function submitPlayerList() {
    const playerListDOM = document.getElementsByClassName('playerList');
    let playerList = [];
    avoidGameRole = [];
    collisionColors = ['#cc99ff', '#99ff99', '#ffcc99', '#99ccff',
                       '#66ffff', '#ff99ff', '#ffff99', '#ff9999'];

    for (let i = 0; i < playerListDOM.length; i++) {
      // reset anything done by focusError() or highlightCollisions()
      playerListDOM[i].style.color = 'black';
      playerListDOM[i].style.backgroundColor = 'white';
      let input = playerListDOM[i].value.toLowerCase();
      playerList[i] = input;
    }

    if (!verifyList(playerList, playerListDOM, rolesArray)) {
      return;
    }

    const keys = Object.keys(playerRoleList);
    for (let i = 0; i < playerList.length; i++) {
      playerRoleList[keys[i]] = playerList[i];
    }

    matchSearch();
  }
  // fills roleMatches with role and game role matches
  function matchSearch() {
    // clear the roleMatches of old information
    for (let i in roleMatches) {
      roleMatches[i] = [];
    }

    for (let i in playerRoleList) {
      let playerRole = playerRoleList[i];

      for (let j in gameRoleList) {
        let gameRoles = gameRoleList[j];

        for (let k = 0; k < gameRoles.length; k++) {
          if (playerRole === gameRoles[k]) {
            // roleMatches and playerRoleList share same keys
            roleMatches[i].push(j)
            break;
          }
        }
      }
    }

    // if a role was not given a match, highlight it
    for (let i in playerRoleList) {
      if (playerRoleList[i] !== '' && roleMatches[i].length === 0) {
        collisions.push(i);
        highlightCollisions(collisions);
      }
    }

    assignContainers();
  }
  
  function assignContainers() {
    // clear past data
    collisions = [];
    let collisionCheck = 0;
    for (let i in containers) {
      containers[i] = '';
    }

    for (let i in roleMatches) {
      // go thru game roles that player (i) can be
      let gameRoles = roleMatches[i];
      collisions = [];

      // iterate over those game roles
      for (let j = 0; j < gameRoles.length; j++) {
        // check containers for this game role
        let gameRole = gameRoles[j];      

        // if container is open, player[i] occupies it
        // else if all containers are occupied...
        if (containers[gameRole] === '') {
          containers[gameRole] = i;
          break;
        } else if (j === gameRoles.length-1) {
          // ...check containers for possibility of switching containers
          // also add current player for possible collision
          collisions.push(i);
          for (let k = 0; k < gameRoles.length; k++) {
            let gameRole = gameRoles[k];
            let occupier = containers[gameRole];

            // if occupier has no where else to go, push to collisions
            // else we check if it can change containers
            if (roleMatches[occupier].length === 1) {
              collisions.push(occupier);
              let uniqueCollisions = [...new Set(collisions)];
              console.log('Collision');
              console.log(uniqueCollisions);
              highlightCollisions(uniqueCollisions);
            } else {
              avoidGameRole = [];
              avoidGameRole.push(gameRole);
              if (containerHelper(occupier, avoidGameRole)) {
                containers[gameRole] = i;
                collisions = [];
                // break is okay here, j is at its last iteration
                break;
              } else if (k === gameRoles.length-1) {
                let uniqueCollisions = [...new Set(collisions)];
                console.log('Collision');
                console.log(uniqueCollisions);
                highlightCollisions(uniqueCollisions);
              }
            }
          }
        }
      }
    }

    console.log(roleMatches);
    console.log(containers);
  }

  // code will be similar to assignContainers(), but with recursion
  function containerHelper(occupier, gameRoleAvoid) {
    let gameRoles = roleMatches[occupier];
    collisions.push(occupier);

    for (let i = 0; i < gameRoles.length; i++) {
      let gameRole = gameRoles[i];

      // dont want to repeat same role
      if (gameRoleAvoid.includes(gameRole)) {
        if (i === gameRoles.length-1) {
          return false;
        }
        continue;
      } else if (containers[gameRole] === '') { 
        containers[gameRole] = occupier;
        return true;
      } else if (i === gameRoles.length-1) {
        for (let j = 0; j < gameRoles.length; j++) {
          let gameRole = gameRoles[j];
          let occupier2 = containers[gameRole];
          if (gameRoleAvoid.includes(gameRole)) {
            if (j === gameRoles.length-1) {
              return false;
            }
            continue;
          } else if (roleMatches[occupier2].length === 1) {
            collisions.push(occupier2);
          } else {
            avoidGameRole.push(gameRole);
            if (containerHelper(occupier2, avoidGameRole)) {
              containers[gameRole] = occupier;
              return true;
            } else {
            return false;
            }
          }
        }
      }
    }
  }

  function highlightCollisions(collisions) {
    const playerListDOM = document.getElementsByClassName('playerList');
    const confirmationDOM = document.getElementsByClassName('confirmationCheckbox');

    if (collisions[1] !== undefined) {
      let collision = collisions[1].substr(10, 12)-1;
      let color = '';

      if (playerListDOM[collision].style.backgroundColor !== 'white') {
        color = playerListDOM[collision].style.backgroundColor;
      } else {
        color = collisionColors.pop();
      }

      for (let i = 0; i < collisions.length; i++) {
        let collision = collisions[i].substr(10, 12)-1;
        if (!confirmationDOM[collision].checked) {
          playerListDOM[collision].style.backgroundColor = color;
        }
      }
    } else {
      color = collisionColors.pop();
      for (let i = 0; i < collisions.length; i++) {
        let collision = collisions[i].substr(10, 12)-1;
        if (!confirmationDOM[collision].checked) {
          playerListDOM[collision].style.backgroundColor = color;
        }
      }
    }
  }

  // adds checkboxes where role editing is available
  function checkboxCheck(_this) {
    const roleList = document.getElementsByClassName('roleList');
    const checkboxesDOM = document.getElementsByClassName('checkboxClass');
    const labelsDOM = document.getElementsByClassName('labelClass');
    let inputIndex;

    for (let i = 0; i < 15; i++) {
      let id = roleList[i].id;
      if (_this.id === id) {
        inputIndex = i;
        break;
      }
    }

    let index = inputIndex * 5;
    let checkboxes = [];
    let labels = [];
    for (let i = 0; i < 5; i++) {
      let checkboxElement = checkboxesDOM[index + i];
      let labelElement = labelsDOM[index + i];
      checkboxes.push(checkboxElement);
      labels.push(labelElement);
    }

    let values = [];
    let roles = [];
    let input = _this.value.toLowerCase();

    if (checkboxRoles[input] !== undefined) {
      values = checkboxRoles[input].values;
      roles = checkboxRoles[input].roles;
      checkboxHelper(checkboxes, labels, values, roles); 
    } else {
      // reset and hide checkboxes and labels
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        checkboxes[i].style.display = 'none';
      }
      for (let i = 0; i < labels.length; i++) {
        labels[i].innerHTML = '';
        labels[i].style.display = 'none';
      }
    }  
  }
   
  // displays checkboxes along with respective labels
  function checkboxHelper(checkboxes, labels, values, roles) {
    for (let i = 0; i < values.length; i++) {
      checkboxes[i].value = values[i];
      labels[i].innerHTML = roles[i];
      checkboxes[i].style.display = 'inline';
      labels[i].style.display = 'inline';
    }
  }

  // debugging tool
  function autoFill() {
    const roleList = document.getElementsByClassName('roleList');
    rolelistarr = Array.from(roleList); 
    
    rolelistarr[0].value = 'Town Government';
    rolelistarr[1].value = 'Town Investigative';
    rolelistarr[2].value = 'Town Investigative';
    rolelistarr[3].value = 'Town Protective';
    rolelistarr[4].value = 'Town Protective';
    rolelistarr[5].value = 'Town Killing';
    rolelistarr[6].value = 'Town Killing';
    rolelistarr[7].value = 'Town Power';
    rolelistarr[8].value = 'Town Power';
    rolelistarr[9].value = 'Godfather';
    rolelistarr[10].value = 'Mafia Deception';
    rolelistarr[11].value = 'Mafia Support';
    rolelistarr[12].value = 'Neutral Killing';
    rolelistarr[13].value = 'Neutral Evil';
    rolelistarr[14].value = 'Neutral Benign';

    for (let i = 0; i < rolelistarr.length; i++) {
      checkboxCheck(rolelistarr[i]);
    }
  }  

  // creates HTML tables
  (function () {
    let table = document.createElement('table');
    let placement = document.getElementById('roleListPlacement');

    let tr = document.createElement('tr');
    let header = document.createElement('th');
    let roleListText = document.createTextNode('Role List');
    table.appendChild(tr);
    tr.appendChild(header);
    header.appendChild(roleListText);

    for (let i = 1; i <= 15; i++) {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      let input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('class', 'roleList');
      input.setAttribute('id', 'gameRole' + i);
      input.addEventListener('input', function(){ checkboxCheck(this) });

      // add autocomplete functionality
      new autoComplete({
        selector: input,
        minChars: 3,
        source: function(term, suggest) {
          term = term.toLowerCase();
          let choices = Object.keys(roleCategories);
          let matches = [];
          for (let i = 0; i < choices.length; i++) {
            if (~choices[i].toLowerCase().indexOf(term)) {
              matches.push(choices[i]);
            }
          }
          suggest(matches);
        },
        onSelect: function(e, term, item ){
          let list = document.getElementsByClassName('roleList');
          listarr = Array.from(list); 
          for (let i = 0; i < listarr.length; i++) {
            checkboxCheck(listarr[i]);
          }
        }
      });

      // create checkboxes
      let checkboxData = document.createElement('td');
      for (let j = 1; j <= 5; j++) {
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('class', 'checkboxClass');
        checkbox.style.display = 'none';
        let label = document.createElement('label');
        label.setAttribute('for', 'checkbox' + j);
        label.setAttribute('class', 'labelClass');
        checkboxData.appendChild(checkbox);
        checkboxData.appendChild(label);
      }

      table.appendChild(tr);
      tr.appendChild(td);
      tr.appendChild(checkboxData);
      td.appendChild(input);
    }

    placement.appendChild(table);

    table = document.createElement('table');
    table.setAttribute('id', 'playerListTable');
    placement = document.getElementById('playerListPlacement');
    const colors = ['#B4141E', '#0042FF', '#1CA7EA', '#6900A1', '#EBE129',
                  '#FE8A0E', '#168000', '#CCA6FC', '#A633BF', '#525494',
                  '#168962', '#753F06', '#96FF91', '#464646', '#E55BB0'];

    let tr2 = document.createElement('tr');
    let header2 = document.createElement('th');
    let header3 = document.createElement('th');
    let header4 = document.createElement('th');
    let header5 = document.createElement('th');
    let playerListText = document.createTextNode('Player List');
    let confirmedText = document.createTextNode('Confirmed');
    table.appendChild(tr2);
    tr2.appendChild(header2);
    tr2.appendChild(header3);
    tr2.appendChild(header4);
    tr2.appendChild(header5);
    header2.appendChild(playerListText);
    header5.appendChild(confirmedText);

    for (let i = 1; i <= 15; i++) {
      let tr = document.createElement('tr');
      tr.setAttribute('id', 'player' + i);
      let td = document.createElement('td');
      td.innerHTML = i + '.';
      td.setAttribute('class', 'playerListStyle');
      let td2 = document.createElement('td');
      td2.innerHTML = 'Player ';
      td2.setAttribute('class', 'playerListStyle');
      td2.style.color = colors[i-1];
      let td3 = document.createElement('td');
      let input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('id', 'player' + i + 'Role');
      input.setAttribute('class', 'playerList');
      let td4 = document.createElement('td');
      let checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('class', 'confirmationCheckbox');

      // add autocomplete functionality
      new autoComplete({
        selector: input,
        minChars: 2,
        source: function(term, suggest) {
          term = term.toLowerCase();
          let choices = rolesArray;
          let matches = [];
          for (let i = 0; i < choices.length; i++) {
            if (~choices[i].toLowerCase().indexOf(term)) {
              matches.push(choices[i]);
            }
          }
          suggest(matches);
        }
      });

      table.appendChild(tr);
      tr.appendChild(td);
      tr.appendChild(td2);
      tr.appendChild(td3);
      td3.appendChild(input);
      tr.appendChild(td4);
      td4.appendChild(checkbox);
    }

    placement.appendChild(table);
  }());
}