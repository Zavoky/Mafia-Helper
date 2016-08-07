if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}

function ready() {

  function submitRoleList() {
    const roleList = document.getElementsByClassName('roleList');
    let roleListArray = [];

    for (let i = 0; i < roleList.length; i++) {
      roleListArray[i] = roleList[i].value.toLowerCase();
      roleList[i].style.color = 'black';
    }

    if (!verifyRoleList(roleListArray, roleCategories, roleList)) {
      console.log('Input not valid');
      return;
    }
    assignRoles(roleListArray);
    playerListSubmit.addEventListener('click', matchSearch);
  }

  function submitPlayerList() {
    const playerList = document.getElementsByClassName('playerList');
    let playerListArray = [];

    for (let i = 0; i < playerList.length; i++) {
      playerListArray[i] = playerList[i].value.toLowerCase();
      playerList[i].style.color = 'black';
    }

    if (!verifyPlayerList(playerListArray, allRolesArray, playerList)) {
      console.log('Input not valid');
      return;
    }

    const keys = Object.keys(playerRoleList);
    for (let i = 0; i < playerListArray.length; i++) {
      playerRoleList[keys[i]] = playerListArray[i];
    }
  }

  function assignRoles(list) {
    const categories = Object.keys(roleCategories);
    const keys = Object.keys(gameRoleList);

    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (list[i] === categories[j]) {
          let category = categories[j];
          let roles = roleCategories[category];

          for (let k = 0; k < roles.length; k++) {
            gameRoleList[keys[i]].push(roles[k]);
          }
          break;
        }
      }
    }
  }

  function verifyRoleList(roleListArray, verifyArray, roleList) {
    const categories = Object.keys(roleCategories);

    for (let i = 0; i < roleListArray.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (roleListArray[i] === categories[j]) {
          break;
        }
        else if (j === categories.length-1) {
          focusError(i, roleList);
          return false;
        }
      }
    }
    return true;
  }

  function verifyPlayerList(playerListArray, verifyArray, playerList) {
    for (let i = 0; i < playerListArray.length; i++) {
      for (let j = 0; j < verifyArray.length; j++) {
        if (playerListArray[i] === '' ||
            playerListArray[i] === verifyArray[j]) {
          break;
        } else if (j === verifyArray.length-1) {
          focusError(i, playerList);
          return false;
        }
      }
    }
    return true;
  }

  function focusError(index, list) {
    list[index].focus();
    list[index].style.color = 'red';
    list[index].value = 'Invalid Role';
  }

  function matchSearch() {
    const playerKeys = Object.keys(playerRoleList);
    const roleKeys = Object.keys(gameRoleList);
    const matchKeys = Object.keys(roleMatches);

    // go thru all keys of playerRoleList
    for (let i = 0; i < playerKeys.length; i++) {
      let playerRole = playerRoleList[playerKeys[i]];

      // go thru all keys of gameRoleList
      for (let j = 0; j < roleKeys.length; j++) {
        let gameRole = gameRoleList[roleKeys[j]];

        // go thru game roles inside gameRoleList[gameRole3]
        for (let k = 0; k < gameRole.length; k++) {

          // if playerRole is 
          if (playerRole === gameRole[k]) {
            roleMatches[matchKeys[i]].push(roleKeys[j]);
            break;
          }
        }
      }
    }
    // for (let i in playerRoleList) {
    //   let playerRole = playerRoleList[i];

    //   for (let j in gameRoleList) {
    //     let gameRole = gameRoleList[j];

    //     for (let k = 0; k < gameRole.length; k++) {
          
    //       if (playerRole === gameRole[k]) {
    //        roleMatches[i].push(j)
    //       }
    //     }
    //   }
    // }

    console.log(roleMatches);
    assignContainers();
  }

  function assignContainers() {
    const matchKeys = Object.keys(roleMatches);
    const containerKeys = Object.keys(containers);
    const roleKeys = Object.keys(gameRoleList);

    // go thru all keys of roleMatches
    for (let i = 0; i < matchKeys.length; i++) {
      let gameRole = roleMatches[matchKeys[i]];

      // go thru game roles inside roleMatches[playerRole3]
      for (let j = 0; j < gameRole.length; j++) {
        // gameRoleList and containers share key names
        // if the container for that game role is empty
        if (containers[gameRole[j]] === '') {
          // that container recieves the player role key (playerRole3)
          containers[gameRole[j]] =  matchKeys[i];
          break;
        }
      }
    }
    console.log(containers);
  }

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

  function createTables() {
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
  }

  createTables();
  const roleListSubmit = document.getElementById('roleListSubmit');
  const playerListSubmit = document.getElementById('playerListSubmit');
  roleListSubmit.addEventListener('click', submitRoleList);
  playerListSubmit.addEventListener('click', submitPlayerList)
  document.getElementById('autofillButton').addEventListener('click', autoFill);
  document.getElementById('autofillButton2').addEventListener('click', autoFill2);

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

  const allRolesArray = ['bodyguard', 'bus driver', 'citizen', 'coroner', 'crier',
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