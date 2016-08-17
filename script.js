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
    playerListSubmit.addEventListener('click', submitPlayerList);
  }

  function submitPlayerList() {
    const playerListDOM = document.getElementsByClassName('playerList');
    let playerList = [];
    avoidGameRole = [];
    collisionColors = ['#cc99ff', '#99ff99', '#ffcc99', '#99ccff',
                       '#66ffff', '#ff99ff', '#ffff99', '#ff9999'];

    for (let i = 0; i < playerListDOM.length; i++) {
      playerList[i] = playerListDOM[i].value.toLowerCase();

      // reset anything done by focusError() or highlightCollisions()
      playerListDOM[i].style.color = 'black';
      playerListDOM[i].style.backgroundColor = 'white';
    }

    if (!verifyList(playerList, playerListDOM, rolesArray)) {
      console.log('Input not valid');
      return;
    }

    const keys = Object.keys(playerRoleList);
    for (let i = 0; i < playerList.length; i++) {
      playerRoleList[keys[i]] = playerList[i];
    }

    matchSearch();
  }

  // fill the checkbox array of roles to avoid
  function checkboxRolesAssign() {
    let checkboxes = document.getElementsByClassName('checkboxClass');

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        let number = checkboxes[i].parentElement.id.substr(12, 14);
        let index = 'gameRole' + number;
        let checkbox = checkboxes[i].value;
        console.log(roleCategories[checkbox]);
        Array.prototype.push.apply(checkboxRoles[index], roleCategories[checkbox]);
      }
    }
  }

  // game categories change into respective game roles
  function assignRoles(list) {
    for (let i in gameRoleList) {
      gameRoleList[i] = [];
    }
    checkboxRolesAssign();
    console.log(checkboxRoles);

    const gameRoles = Object.keys(gameRoleList);

    for (let i = 0; i < list.length; i++) {
      for (let j in roleCategories) {
        if (list[i] === j) {
          let roles = roleCategories[j];
          for (let k = 0; k < roles.length; k++) {
            // checkboxRoles and gameRoleList share indexes
            if (!checkboxRoles[gameRoles[i]].includes(roles[k])) {
              gameRoleList[gameRoles[i]].push(roles[k]);
            }
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
    let number = _this.id.substr(8, 10);
    let checkbox = document.getElementById('checkboxData' + number);
    let checkboxes = {
      checkbox1: document.getElementById(checkbox.id + 'checkbox1'),
      checkbox2: document.getElementById(checkbox.id + 'checkbox2'),
      checkbox3: document.getElementById(checkbox.id + 'checkbox3'),
      checkbox4: document.getElementById(checkbox.id + 'checkbox4'),
      checkbox5: document.getElementById(checkbox.id + 'checkbox5')
    };
    let labels = {
      label1: document.getElementById(checkbox.id + 'label1'),
      label2: document.getElementById(checkbox.id + 'label2'),
      label3: document.getElementById(checkbox.id + 'label3'),
      label4: document.getElementById(checkbox.id + 'label4'),
      label5: document.getElementById(checkbox.id + 'label5')
    };

    switch(_this.value.toLowerCase()) {
      case 'any random': {
        for (let i in checkboxes) {
          checkboxes[i].style.display = 'inline';
        }
        for (let i in labels) {
          labels[i].style.display = 'inline';
        }
        checkboxes.checkbox1.value = 'Citizen';
        checkboxes.checkbox2.value = 'Citizen';
        checkboxes.checkbox3.value = 'Citizen';
        checkboxes.checkbox4.value = 'Citizen';
        checkboxes.checkbox5.value = 'Citizen';
        labels.label1.innerHTML = 'Kill';
        labels.label2.innerHTML = 'Mafia';
        labels.label3.innerHTML = 'Town';
        labels.label4.innerHTML = 'Neutral';
        labels.label5.innerHTML = 'Triad';
        break;
      }
      case 'town random': {
        for (let i in checkboxes) {
          checkboxes[i].style.display = 'inline';
        }
        for (let i in labels) {
          labels[i].style.display = 'inline';
        }
        checkboxes.checkbox1.value = 'town killing';
        checkboxes.checkbox2.value = 'town government';
        checkboxes.checkbox3.value = 'town investigative';
        checkboxes.checkbox4.value = 'town protective';
        checkboxes.checkbox5.value = 'town power';
        labels.label1.innerHTML = 'Kill';
        labels.label2.innerHTML = 'Gov';
        labels.label3.innerHTML = 'Invest';
        labels.label4.innerHTML = 'Prot';
        labels.label5.innerHTML = 'Power';
        break;
      }
      case 'town government': {
        for (let i in checkboxes) {
          checkboxes[i].style.display = 'inline';
        }
        for (let i in labels) {
          labels[i].style.display = 'inline';
        }
        checkboxes.checkbox1.value = 'citizen';
        checkboxes.checkbox2.value = 'mason';
        checkboxes.checkbox3.value = 'mayor';
        checkboxes.checkbox4.value = 'mason leader';
        checkboxes.checkbox5.value = 'crier';
        labels.label1.innerHTML = 'Cit';
        labels.label2.innerHTML = 'Mas';
        labels.label3.innerHTML = 'Mayor/Marsh';
        labels.label4.innerHTML = 'ML';
        labels.label5.innerHTML = 'Crier';
        break;
      }
      case 'town investigative': {
        for (let i in checkboxes) {
          checkboxes[i].style.display = 'inline';
        }
        for (let i in labels) {
          labels[i].style.display = 'inline';
        }
        checkboxes.checkbox1.value = 'coroner';
        checkboxes.checkbox2.value = 'sheriff';
        checkboxes.checkbox3.value = 'investigator';
        checkboxes.checkbox4.value = 'detective';
        checkboxes.checkbox5.value = 'lookout';
        labels.label1.innerHTML = 'Coro';
        labels.label2.innerHTML = 'Sher';
        labels.label3.innerHTML = 'Invest';
        labels.label4.innerHTML = 'Det';
        labels.label5.innerHTML = 'LO';
        break;
      }
      case 'town protective': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        checkboxes.checkbox4.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        labels.label4.style.display = 'inline';
        checkboxes.checkbox1.value = 'bus driver';
        checkboxes.checkbox2.value = 'bodyguard';
        checkboxes.checkbox3.value = 'doctor';
        checkboxes.checkbox4.value = 'escort';
        labels.label1.innerHTML ='BD';
        labels.label2.innerHTML ='BG';
        labels.label3.innerHTML ='Doc';
        labels.label4.innerHTML ='Escort';
        break;
      }
      case 'town killing': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        checkboxes.checkbox4.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        labels.label4.style.display = 'inline';
        checkboxes.checkbox1.value = 'veteran';
        checkboxes.checkbox2.value = 'jailor';
        checkboxes.checkbox3.value = 'bodyguard';
        checkboxes.checkbox4.value = 'vigilante';
        labels.label1.innerHTML ='Vet';
        labels.label2.innerHTML ='Jail';
        labels.label3.innerHTML ='BG';
        labels.label4.innerHTML ='Vig';
        break;
      }
      case 'town power': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        checkboxes.checkbox4.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        labels.label4.style.display = 'inline';
        checkboxes.checkbox1.value = 'veteran';
        checkboxes.checkbox2.value = 'spy';
        checkboxes.checkbox3.value = 'bus driver';
        checkboxes.checkbox4.value = 'jailor';
        labels.label1.innerHTML ='Vet';
        labels.label2.innerHTML ='Spy';
        labels.label3.innerHTML ='BD';
        labels.label4.innerHTML ='Jail';
        break;
      }
      case 'mafia random': {
        checkboxes.checkbox1.style.display = 'inline';
        labels.label1.style.display = 'inline';
        checkboxes.checkbox1.value = 'mafia killing';
        labels.label1.innerHTML ='Kill';
        break;
      }
      case 'mafia killing': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        checkboxes.checkbox4.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        labels.label4.style.display = 'inline';
        checkboxes.checkbox1.value = 'disguiser';
        checkboxes.checkbox2.value = 'kidnapper';
        checkboxes.checkbox3.value = 'mafia';
        checkboxes.checkbox4.value = 'godfather';
        labels.label1.innerHTML ='Disg';
        labels.label2.innerHTML ='Kidnap';
        labels.label3.innerHTML ='Maf';
        labels.label4.innerHTML ='GF';
        break;
      }
      case 'mafia support': {
        for (let i in checkboxes) {
          checkboxes[i].style.display = 'inline';
        }
        for (let i in labels) {
          labels[i].style.display = 'inline';
        }
        checkboxes.checkbox1.value = 'blackmailer';
        checkboxes.checkbox2.value = 'kidnapper';
        checkboxes.checkbox3.value = 'consort';
        checkboxes.checkbox4.value = 'consigilere';
        checkboxes.checkbox5.value = 'agent';
        labels.label1.innerHTML = 'BM';
        labels.label2.innerHTML = 'Kidnap';
        labels.label3.innerHTML = 'Consort';
        labels.label4.innerHTML = 'Consig';
        labels.label5.innerHTML = 'Agent';
        break;
      }
      case 'mafia deception': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        checkboxes.checkbox4.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        labels.label4.style.display = 'inline';
        checkboxes.checkbox1.value = 'disguiser';
        checkboxes.checkbox2.value = 'framer';
        checkboxes.checkbox3.value = 'janitor';
        checkboxes.checkbox4.value = 'beguiler';
        labels.label1.innerHTML ='Disg';
        labels.label2.innerHTML ='Frame';
        labels.label3.innerHTML ='Jani';
        labels.label4.innerHTML ='Begu';
        break;
      }
      case 'triad random': {
        checkboxes.checkbox1.style.display = 'inline';
        labels.label1.style.display = 'inline';
        checkboxes.checkbox1.value = 'triad killing';
        labels.label1.innerHTML ='Kill';
        break;
      }
      case 'triad killing': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        checkboxes.checkbox4.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        labels.label4.style.display = 'inline';
        checkboxes.checkbox1.value = 'informant';
        checkboxes.checkbox2.value = 'interrogator';
        checkboxes.checkbox3.value = 'enforcer';
        checkboxes.checkbox4.value = 'dragon head';
        labels.label1.innerHTML ='Info';
        labels.label2.innerHTML ='Inter';
        labels.label3.innerHTML ='Enfor';
        labels.label4.innerHTML ='DH';
        break;
      }
      case 'triad support': {
        for (let i in checkboxes) {
          checkboxes[i].style.display = 'inline';
        }
        for (let i in labels) {
          labels[i].style.display = 'inline';
        }
        checkboxes.checkbox1.value = 'silencer';
        checkboxes.checkbox2.value = 'interrogator';
        checkboxes.checkbox3.value = 'liaison';
        checkboxes.checkbox4.value = 'administrator';
        checkboxes.checkbox5.value = 'vanguard';
        labels.label1.innerHTML = 'Sile';
        labels.label2.innerHTML = 'Inter';
        labels.label3.innerHTML = 'Liais';
        labels.label4.innerHTML = 'Admin';
        labels.label5.innerHTML = 'Van';
        break;
      }
      case 'triad deception': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        checkboxes.checkbox4.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        labels.label4.style.display = 'inline';
        checkboxes.checkbox1.value = 'informant';
        checkboxes.checkbox2.value = 'forger';
        checkboxes.checkbox3.value = 'incense master';
        checkboxes.checkbox4.value = 'deceiver';
        labels.label1.innerHTML ='Info';
        labels.label2.innerHTML ='Forg';
        labels.label3.innerHTML ='Incen';
        labels.label4.innerHTML ='Decei';
        break;
      }
      case 'neutral random': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        checkboxes.checkbox1.value = 'neutral killing';
        checkboxes.checkbox2.value = 'neutral evil';
        checkboxes.checkbox3.value = 'neutral benign';
        labels.label1.innerHTML ='Kill';
        labels.label2.innerHTML ='Evil';
        labels.label3.innerHTML ='Benign';
        break;
      }
      case 'neutral killing': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        checkboxes.checkbox1.value = 'serial killer';
        checkboxes.checkbox2.value = 'arsonist';
        checkboxes.checkbox3.value = 'mass murderer';
        labels.label1.innerHTML ='SK';
        labels.label2.innerHTML ='Arso';
        labels.label3.innerHTML ='MM';
        break;
      }
      case 'neutral evil': {
        for (let i in checkboxes) {
          checkboxes[i].style.display = 'inline';
        }
        for (let i in labels) {
          labels[i].style.display = 'inline';
        }
        checkboxes.checkbox1.value = 'neutral killing';
        checkboxes.checkbox2.value = 'cultist';
        checkboxes.checkbox3.value = 'judge';
        checkboxes.checkbox4.value = 'witch';
        checkboxes.checkbox5.value = 'auditor';
        labels.label1.innerHTML = 'Kill';
        labels.label2.innerHTML = 'Cult';
        labels.label3.innerHTML = 'Judg';
        labels.label4.innerHTML = 'Witc';
        labels.label5.innerHTML = 'Audi';
        break;
      }
      case 'neutral benign': {
        checkboxes.checkbox1.style.display = 'inline';
        checkboxes.checkbox2.style.display = 'inline';
        checkboxes.checkbox3.style.display = 'inline';
        checkboxes.checkbox4.style.display = 'inline';
        labels.label1.style.display = 'inline';
        labels.label2.style.display = 'inline';
        labels.label3.style.display = 'inline';
        labels.label4.style.display = 'inline';
        checkboxes.checkbox1.value = 'survivor';
        checkboxes.checkbox1.value = 'jester';
        checkboxes.checkbox1.value = 'executioner';
        checkboxes.checkbox1.value = 'amnesiac';
        labels.label1.innerHTML ='Surv';
        labels.label2.innerHTML ='Jest';
        labels.label3.innerHTML ='Exec';
        labels.label4.innerHTML ='Amne';
        break;
      }
      default: {
        for (let i in checkboxes) {
          checkboxes[i].checked = false;
          checkboxes[i].style.display = 'none';
        }
        for (let i in labels) {
          labels[i].innerHTML = '';
          labels[i].style.display = 'none';
        }
      }
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
      let checkboxData = document.createElement('td');
      //checkboxData.style.display = 'none';
      checkboxData.setAttribute('id', 'checkboxData' + i);
      let input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('class', 'roleList');
      //input.setAttribute('list', 'categories');
      input.setAttribute('id', 'gameRole' + i);
      input.addEventListener('input', function(){checkboxCheck(this)});

      // add autocomplete functionality
      new autoComplete({
        selector: input,
        minChars: 3,
        source: function(term, suggest) {
          term = term.toLowerCase();
          let choices = roleAutoComplete.concat(rolesArray);
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

      for (let j = 1; j <= 5; j++) {
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', checkboxData.id + 'checkbox' + j);
        checkbox.setAttribute('class', 'checkboxClass');
        checkbox.style.display = 'none';
        let label = document.createElement('label');
        label.setAttribute('for', 'checkbox' + j);
        label.setAttribute('id', checkboxData.id + 'label' + j);
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

  const roleListSubmit = document.getElementById('roleListSubmit');
  const playerListSubmit = document.getElementById('playerListSubmit');
  roleListSubmit.addEventListener('click', submitRoleList);
  document.getElementById('autofillButton').addEventListener('click', autoFill);
  document.getElementById('autofillButton2').addEventListener('click', autoFill2);

  let collisionColors = [];
  let collisions = [];

  let checkboxRoles = {
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
                      'serial killer', 'survivor', 'witch', 'witch doctor'
                      ];
  
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

  const roleAutoComplete = ['town random', 'town government', 'town investigative',
                            'town protective', 'town killing', 'town power',
                            'mafia random', 'mafia killing', 'mafia deception',
                            'mafia killing', 'mafia deception', 'mafia support',
                            'triad random', 'triad killing', 'triad deception',
                            'triad support', 'neutral random', 'neutral killing',
                            'neutral evil', 'neutral benign', 'any random'
                            ];
}