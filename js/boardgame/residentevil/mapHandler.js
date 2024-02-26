function isAlreadyRevealed (nameId) {
  const clickedElement = findScenarioIndexById(nameId)

  const lookingScenario = gameStatus.scenarios[clickedElement]
  let childRevealed = false
  lookingScenario.unlocks.forEach(element => {
    const childIndex = findScenarioIndexByName(element)
    if (gameStatus.scenarios[childIndex].discovered) {
      childRevealed = true
    }
  })
  return childRevealed
}

function completeLevel () {
  const rectElement = lastMapElement.getElementsByTagName('rect')
  const scenarioIndex = findScenarioIndexById(lastMapElement.id)
  if (gameStatus.scenarios[scenarioIndex].completed) {
    gameStatus.scenarios[scenarioIndex].completed = false
    rectElement[0].setAttribute('fill', LEVEL_COLORS.UNCOMPLETED)
  } else {
    gameStatus.scenarios[scenarioIndex].completed = true
    rectElement[0].setAttribute('fill', LEVEL_COLORS.COMPLETED)
  }
  gameStatus.save()
  lastMapElement = null
}

function unlockLevel () {
  const scenarioIndex = findScenarioIndexById(lastMapElement.id)
  const pathElement = lastMapElement.getElementsByTagName('path')[0]
  if (pathElement.id.includes('Locked') && gameStatus.scenarios[scenarioIndex].locked) {
    gameStatus.scenarios[scenarioIndex].locked = false
    pathElement.setAttribute('hidden', true)
  } else {
    gameStatus.scenarios[scenarioIndex].locked = true
    pathElement.removeAttribute('hidden')
  }
  gameStatus.save()
}

function revealLevel () {
  const clickedElement = findScenarioIndexById(lastMapElement.id)

  if (isAlreadyRevealed(lastMapElement.id)) {
    gameStatus.scenarios[clickedElement].unlocks.forEach(element => {
      hideScenario(element)
    })
    gameStatus.save()
    return
  }
  const revealedPaths = []
  for (const child of mapPaths.children) {
    if (child.id.includes(lastMapElement.id)) {
      child.removeAttribute('hidden')
      revealedPaths.push(child.id)
    }
  }

  revealedPaths.forEach(element => {
    const mapId = element.replaceAll(lastMapElement.id, '').replaceAll('_-_', '')
    const scenarioIndex = findScenarioIndexById(mapId)
    if (scenarioIndex >= 0) {
      gameStatus.scenarios[scenarioIndex].discovered = true
    }
    const mapToReveal = svgElement.getElementById(mapId)
    mapToReveal.removeAttribute('hidden')
  })
  lastMapElement = null
  gameStatus.save()
}

function hideScenario (hideElement) {
  const hideIndex = findScenarioIndexByName(hideElement)
  gameStatus.scenarios[hideIndex].discovered = false
  const hideId = hideElement.replaceAll(' ', '_')
  const mapToHide = svgElement.getElementById(hideId)
  mapToHide.setAttribute('hidden', true)

  for (const child of mapPaths.children) {
    if (child.id.includes(hideId)) {
      child.setAttribute('hidden', 'true')
    }
  }
  gameStatus.scenarios[hideIndex].unlocks.forEach(element => { hideScenario(element) })
}

function findScenarioIndexByName (name) {
  return gameStatus.scenarios.findIndex(element => {
    return element.name === name
  })
}

function findScenarioIndexById (name) {
  return gameStatus.scenarios.findIndex(element => {
    return element.name.replaceAll(' ', '_') === name
  })
}

function buildStartingMap () {
  console.log('buildStartingMap')
  gameStatus.scenarios.forEach(element => {
    const nameId = element.name.replaceAll(' ', '_')
    const svgGroup = svgElement.getElementById(nameId)
    lastMapElement = svgGroup
    svgGroup.addEventListener('click', openModal)
    svgGroup.setAttribute('data-bs-toggle', 'modal')
    svgGroup.setAttribute('data-bs-target', '#mapModal')
    console.log(element)
    if (!element.discovered) {
      svgGroup.setAttribute('hidden', true)
    } else {
      svgGroup.removeAttribute('hidden')
    }
    if (element.completed) {
      const rectElement = svgGroup.getElementsByTagName('rect')
      rectElement[0].setAttribute('fill', LEVEL_COLORS.COMPLETED)
    } else {
      const rectElement = svgGroup.getElementsByTagName('rect')
      rectElement[0].setAttribute('fill', LEVEL_COLORS.UNCOMPLETED)
    }
    if (!element.locked && element.lockedBy) {
      const rectElement = svgGroup.getElementsByTagName('path')
      rectElement[0].setAttribute('hidden', true)
    } else if (element.locked && element.lockedBy) {
      const fixedName = element.name.replaceAll(' ', '_')
      const rectElement = svgGroup.getElementsByTagName('path')
      const elementById = document.getElementById(rectElement[0].id)
      elementById.removeAttribute('hidden')
    }
  })
  initialMapPaths()
}

function initialMapPaths () {
  for (const child of mapPaths.children) {
    if (!child.id.includes('Main_Hall')) {
      const scenarios = child.id.split('_-_')
      const firstScenario = gameStatus.scenarios.findIndex(element => {
        return element.name.replaceAll(' ', '_') === scenarios[0]
      })
      const secondScenario = gameStatus.scenarios.findIndex(element => {
        return element.name.replaceAll(' ', '_') === scenarios[1]
      })
      if (!gameStatus.scenarios[firstScenario].discovered || !gameStatus.scenarios[secondScenario].discovered) {
        child.setAttribute('hidden', true)
      } else {
        child.removeAttribute('hidden')
      }
    }
  }
}
