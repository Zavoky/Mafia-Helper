if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}

function ready() {

  function submitRoleList() {
    const roleListDOM = document.getElementsByClassName('roleList');
    let roleList = [];

    for (let i = 0; i < roleListDOM.length; i++) {
      roleList[i] = roleListDOM[i].value.toLowerCase();

      // reset anything done by focusError()
      roleListDOM[i].style.color = 'black';
    }
    if (!verifyList(roleList, roleListDOM, roleCategories)) {
      console.log('Role list is not valid');
      return;
    }

    assignRoles(roleList);
    playerListSubmit.addEventListener('click', matchSearch);
  }

  function submitPlayerList() {
    const playerListDOM = document.getElementsByClassName('playerList');
    let playerList = [];

    for (let i = 0; i < playerListDOM.length; i++) {
      playerList[i] = playerListDOM[i].value.toLowerCase();

      // reset anything done by focusError() / highlightCollisions()
      playerListDOM[i].style.color = 'black';
    }

    if (!verifyList(playerList, playerListDOM, rolesArray)) {
      console.log('Input not valid');
      return;
    }

    const keys = Object.keys(playerRoleList);
    for (let i = 0; i < playerList.length; i++) {
      playerRoleList[keys[i]] = playerList[i];
    }
  }

  // game categories change into respective game roles
  function assignRoles(list) {
    for (let i in gameRoleList) {
      gameRoleList[i] = [];
    }

    const gameRoles = Object.keys(gameRoleList);

    for (let i = 0; i < list.length; i++) {
      for (let j in roleCategories) {
        if (list[i] === j) {
          let roles = roleCategories[j];
          for (let k = 0; k < roles.length; k++) {
            gameRoleList[gameRoles[i]].push(roles[k]);
          }
        }
      }
    }
  }

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
              highlightCollisions(uniqueCollisions, 'blue');
            } else {
              let avoidGameRole = [];
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
                highlightCollisions(uniqueCollisions, 'red');
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

  function highlightCollisions(collisions, color) {
    const playerListDOM = document.getElementsByClassName('playerList');

    for (let i = 0; i < collisions.length; i++) {
      let collision = collisions[i].substr(10, 12)-1;
      playerListDOM[collision].style.color = color;
    }
  }

  // debugging tool
  function autoFill() {
    const roleList = document.getElementsByClassName('roleList');
    rolelistarr = Array.from(roleList);
    for (let i = 0; i < 15; i++) {
      rolelistarr[i].value = 'Any Random';
    }
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
  }  

  // debugging tool
  function autoFill2() {
    const playerList = document.getElementsByClassName('playerList');
    rolelistarr = Array.from(playerList);
    for (let i = 0; i < 15; i++) {
      rolelistarr[i].value = 'Jester';
    } 
    rolelistarr[0].value = 'Mayor';
    rolelistarr[1].value = 'Sheriff';
    rolelistarr[2].value = 'Detective';
    rolelistarr[3].value = 'Doctor';
    rolelistarr[4].value = 'Bodyguard';
    rolelistarr[5].value = 'Veteran';
    rolelistarr[6].value = 'Vigilante';
    rolelistarr[7].value = 'Spy';
    rolelistarr[8].value = 'Bus Driver';
    rolelistarr[9].value = 'Godfather';
    rolelistarr[10].value = 'Framer';
    rolelistarr[11].value = 'Kidnapper';
    rolelistarr[12].value = 'Serial Killer';
    rolelistarr[13].value = 'Arsonist';
    rolelistarr[14].value = 'Jester';
  }

  // creates HTML tables
  (function () {
    let table = document.createElement('table');
    let placement = document.getElementById('roleListPlacement');

    for (let i = 1; i <= 15; i++) {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      let input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('class', 'roleList');
      input.setAttribute('list', 'categories')
      table.appendChild(tr);
      tr.appendChild(td);
      td.appendChild(input);
    }

    placement.appendChild(table);

    table = document.createElement('table');
    table.setAttribute('id', 'playerListTable');
    placement = document.getElementById('playerListPlacement');
    const colors = ['#B4141E', '#0042FF', '#1CA7EA', '#6900A1', '#EBE129',
                  '#FE8A0E', '#168000', '#CCA6FC', '#A633BF', '#525494',
                  '#168962', '#753F06', '#96FF91', '#464646', '#E55BB0'];

    for (let i = 1; i <= 15; i++) {
      let tr = document.createElement('tr');
      tr.setAttribute('id', 'player' + i);
      let td = document.createElement('td');
      td.innerHTML = i + '.';
      td.setAttribute('class', 'playerListStyle')
      let td2 = document.createElement('td');
      td2.innerHTML = 'Player ';
      td2.setAttribute('class', 'playerListStyle')
      td2.style.color = colors[i-1];
      let td3 = document.createElement('td');
      let input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('id', 'player' + i + 'Role');
      input.setAttribute('class', 'playerList');
      table.appendChild(tr);
      tr.appendChild(td);
      tr.appendChild(td2);
      tr.appendChild(td3);
      td3.appendChild(input);
    }

    placement.appendChild(table);
  }());

  const roleListSubmit = document.getElementById('roleListSubmit');
  const playerListSubmit = document.getElementById('playerListSubmit');
  roleListSubmit.addEventListener('click', submitRoleList);
  playerListSubmit.addEventListener('click', submitPlayerList)
  document.getElementById('autofillButton').addEventListener('click', autoFill);
  document.getElementById('autofillButton2').addEventListener('click', autoFill2);

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
                         'serial killer', 'survivor', 'witch', 'witch doctor'];
  const roleCategories = {

    'any random' : ['bodyguard', 'bus driver', 'citizen', 'coroner', 'crier',
                    'detective', 'doctor', 'escort', 'investigator', 'jailor',
                    'lookout', 'marshall', 'mason', 'mason leader', 'mayor',
                    'sheriff', 'spy', 'veteran', 'vigilante', 'agent',
                    'beguiler', 'blackmailer', 'consigilere', 'consort',
                    'disguiser', 'framer', 'godfather', 'janitor', 'kidnapper', 
                    'mafioso', 'administrator', 'deceiver', 'dragon head', 'enforcer',
                    'forger', 'incense master', 'informant', 'interrogator', 'liaison',
                    'silencer','vanguard', 'amnesiac', 'arsonist', 'auditor',
                    'cultist', 'executioner', 'jester', 'judge', 'mass murderer', 
                    'serial killer', 'survivor', 'witch', 'witch doctor'],

    'town random' : ['bodyguard', 'bus driver', 'citizen', 'coroner', 'crier',
                     'detective', 'doctor', 'escort', 'investigator', 'jailor',
                     'lookout', 'marshall', 'mason', 'mason leader', 'mayor',
                     'sheriff', 'spy', 'veteran', 'vigilante'],

    'town government' : ['citizen', 'crier', 'marshall', 'mason', 'mason leader', 
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
    'disguiser': ['disguier'], 
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
    'informant': ['informat'], 
    'interrogator': ['iterrogator'], 
    'liaison': ['liasion'],
    'silencer': ['silencer'],
    'vanguard': ['vanguard'], 
    'amnesiac': ['amneisac'],
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
}