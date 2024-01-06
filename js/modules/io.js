function clearAllData () {
  const operation = confirm('Are you sure? The data will be lost')
  if (operation) {
    gameStatus.clear()
    window.location.reload()
  }
}

function exportData (fileName) {
  const downloadLink = document.getElementById('exportFile')
  const jsonString = gameStatus.toJson()
  // Set the download link href to the data URL
  downloadLink.href = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`

  // Set the download link name
  downloadLink.download = `${fileName}.json`

  // Trigger the download
  downloadLink.click()
}

function importData () {
  // Create a new file input element
  const fileInput = document.createElement('input')
  fileInput.type = 'file'

  // Show the file input element and focus on it
  fileInput.click()
  fileInput.focus()
  fileInput.addEventListener('change', (event) => {
    const fileToLoad = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const fileContent = event.target.result
      gameStatus.clear()
      gameStatus.fromJson(fileContent)
      gameStatus.save()
      window.location.reload()
    }
    reader.readAsText(fileToLoad)
  })
}
