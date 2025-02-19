'use strict'

import {thdate, thnum} from '../thdate.mjs'

export default class {
  constructor(container, socket) {
    this.container = container
    
    socket.on('word-stat-error', (data) => console.error(data))
    socket.on('word-view-error', (data) => console.error(data))
    socket.on('word-views-error', (data) => console.error(data))
    socket.on('word-search-error', (data) => console.error(data))
    socket.on('word-add-error', (data) => console.error(data))
    socket.on('word-mod-error', (data) => console.error(data))
    socket.on('word-remove-error', (data) => console.error(data))
    socket.on('word-patch-error', (data) => console.error(data))
    socket.on('word-patch-key-error', (data) => console.error(data))
    socket.on('word-add-prev-error', (data) => console.error(data))
    socket.on('word-mod-prev-error', (data) => console.error(data))
    socket.on('word-patch-prev-error', (data) => console.error(data))
    socket.on('word-remove-prev-error', (data) => console.error(data))
    socket.on('word-add-next-error', (data) => console.error(data))
    socket.on('word-mod-next-error', (data) => console.error(data))
    socket.on('word-patch-next-error', (data) => console.error(data))
    socket.on('word-remove-next-error', (data) => console.error(data))

    socket.on('word-stat-success', (data) => this.renderStat(data.result))
    socket.on('word-view-success', (data) => console.log(data))
    socket.on('word-views-success', (data) => console.log(data))
    socket.on('word-search-success', (data) => console.log(data))
    socket.on('word-patch-success', (data) => console.log(data))
    socket.on('word-patch-key-success', (data) => console.log(data))
    socket.on('word-add-prev-success', (data) => console.log(data))
    socket.on('word-mod-prev-success', (data) => console.log(data))
    socket.on('word-patch-prev-success', (data) => console.log(data))
    socket.on('word-remove-prev-success', (data) => console.log(data))
    socket.on('word-add-next-success', (data) => console.log(data))
    socket.on('word-mod-next-success', (data) => console.log(data))
    socket.on('word-patch-next-success', (data) => console.log(data))
    socket.on('word-remove-next-success', (data) => console.log(data))

    socket.on('word-add-success', (data) => {
      this.insertLastStat({ id: 'lastAdd', word: this.wrapData(data.result), timestamps: 'create' }, { insert: true })
      this.insertLastStat({ id: 'lastMod', word: this.wrapData(data.result), timestamps: 'modified' }, { insert: true })
    })
    socket.on('word-mod-success', (data) => {
      this.insertLastStat({ id: 'lastMod', word: this.wrapData(data.result), timestamps: 'modified' }, { insert: true })
      this.insertLastStat({ id: 'lastHigh', word: this.wrapData(data.result), timestamps: 'modified' })
      this.insertLastStat({ id: 'lastLow', word: this.wrapData(data.result), timestamps: 'modified' })
    })
    socket.on('word-remove-success', (data) => {
      this.insertLastStat({ id: 'lastDel', word: data.result, timestamps: 'modified' }, { insert: true, duplicate: true })
      this.removeDeleted({ id: 'lastAdd', word: data.result })
      this.removeDeleted({ id: 'lastMod', word: data.result })
      this.removeDeleted({ id: 'lastHigh', word: data.result })
      this.removeDeleted({ id: 'lastLow', word: data.result })
    })
  }

  fetch = async () => {
    fetch('/statistics', { method: 'GET' }).then((res) => {
      if (res.status == 200) return res.json().then((data) => this.renderStat(data))
      res.text().then((message) => console.error(message))
    }).catch((err) => console.error(err))
  }

  render = async (socket) => {
    this.mockup()
    // Can use fetch or socket
    this.fetch()
    // socket.emit('word-stat')
    return this
  }

  mockup = () => {
    const statistics = document.createElement('div')
    statistics.className = 'statistics'
    statistics.id = 'statistics'
    const total = document.createElement('div')
    total.className = 'statistics-total'
    total.innerHTML = `มีทั้งหมด 0 คำศัพท์ในพจนานุกรม`
    this.container.appendChild(total)
    const fsection = document.createElement('section')
    const flabel = document.createElement('div')
    const fbox = document.createElement('div')
    const fvalue = document.createElement('div')
    const first = document.createElement('div')
    fsection.className = 'statistics-section'
    flabel.className = 'statistics-label'
    fbox.className = 'statistics-box'
    fvalue.className = 'statistics-value'
    flabel.innerHTML = 'คำศัพท์แรกของพจนานุกรม'
    let html = `<div><div>คำศัพท์</div>&nbsp;</div>`
    html += `<div><div>เพิ่มเมื่อ</div>&nbsp;</div>`
    html += `<div><div>แก้ไขเมื่อ</div>&nbsp;</div>`
    html += `<div><div>เชื่อมโยงมา</div>&nbsp;</div>`
    html += `<div><div>เชื่อมโยงไป</div>&nbsp;</div>`
    first.innerHTML = html
    fvalue.appendChild(first)
    fbox.appendChild(fvalue)
    fsection.appendChild(flabel)
    fsection.appendChild(fbox)
    statistics.appendChild(fsection)
    new Array(
      ['lastHigh', 'คำศัพท์ที่พบบ่อย'],
      ['lastLow', 'คำศัพท์ที่อาจถูกลืม'],
      ['lastAdd', 'คำศัพท์ที่ถูกเพิ่มล่าสุด'],
      ['lastMod', 'คำศัพท์ที่ถูกแก้ไขล่าสุด'],
      ['lastDel', 'คำศัพท์ที่ถูกลบล่าสุด']
    ).forEach((x) => {
      const section = document.createElement('section')
      const label   = document.createElement('div')
      const box     = document.createElement('div')
      const value   = document.createElement('div')
      const ul      = document.createElement('ul')
      section.id    = x[0]
      section.className = 'statistics-section'
      label.className   = 'statistics-label'
      box.className     = 'statistics-box'
      value.className   = 'statistics-value'
      label.innerHTML   = x[1]
      value.appendChild(ul)
      box.appendChild(value)
      section.appendChild(label)
      section.appendChild(box)
      statistics.appendChild(section)
    })
    this.container.appendChild(statistics)
  }

  renderStat = async (data) => {
    const total = document.getElementsByClassName('statistics-total')[0]
    total.textContent = `มีทั้งหมด ${data.total} คำศัพท์ในพจนานุกรม`
    const statistics = document.getElementById('statistics')
    const fsection = statistics.childNodes[0]
    const fbox = fsection.childNodes[1]
    const fvalue = fbox.childNodes[0]
    const first = fvalue.childNodes[0]
    let html = `<div><div>คำศัพท์</div> ${data.first.name == ' ' ? '&nbsp;' : data.first.name}</div>`
    html += `<div><div>เพิ่มเมื่อ</div> ${thdate(new Date(data.first.create), { time: true })}</div>`
    html += `<div><div>แก้ไขเมื่อ</div> ${thdate(new Date(data.first.modified), { time: true })}</div>`
    html += `<div><div>เชื่อมโยงมา</div> ${data.first.previous.length} คำศัพท์</div>`
    html += `<div><div>เชื่อมโยงไป</div> ${data.first.next.length} คำศัพท์</div>`
    first.innerHTML = html
    new Array(
      ['lastHigh', data.lastHigh, 'modified', 'คำศัพท์ที่พบบ่อย'],
      ['lastLow', data.lastLow, 'modified', 'คำศัพท์ที่อาจถูกลืม'],
      ['lastAdd', data.lastAdd, 'create', 'คำศัพท์ที่ถูกเพิ่มล่าสุด'],
      ['lastMod', data.lastMod, 'modified', 'คำศัพท์ที่ถูกแก้ไขล่าสุด'],
      ['lastDel', data.lastDel, 'modified', 'คำศัพท์ที่ถูกลบล่าสุด']
    ).forEach((x) => {
      const section = document.getElementById(x[0])
      const box = section.childNodes[1]
      const value = box.childNodes[0]
      const ul = value.childNodes[0]
      this.extract(ul, x[1], x[2])
    })
  }

  wrapData = (data) => ({
    create  : data.create,
    modified: data.modified,
    counter : data.counter,
    name    : data.name,
    previous: Object.keys(data.tree),
    next    : Object.keys(data.tree[' '])
  })

  extract = (parent, buf, timestamps = 'create') => {
    buf.forEach((word) => {
      const li = document.createElement('li')
      let tooltip = `คำศัพท์ ${word.name == ' ' ? '&nbsp' : word.name}\n`
      tooltip += `เพิ่มเมื่อ ${thdate(new Date(word['create']), { time: true, full: true, thainum: true })}\n`
      tooltip += `แก้ไขเมื่อ ${thdate(new Date(word['modified']), { time: true, full: true, thainum: true })}\n`
      tooltip += `เชื่อมโยงมา ${thnum(word.previous.length)} คำศัพท์\n`
      tooltip += `เชื่อมโยงไป ${thnum(word.next.length)} คำศัพท์`
      li.setAttribute('title', tooltip)
      li.innerHTML = `<div class='date'>${thdate(new Date(word[timestamps]), { time: true })}</div>`
      li.innerHTML += `<div class='previous'>${word.previous.length}</div>`
      li.innerHTML += `<div class='word'>${word.name}</div>`
      li.innerHTML += `<div class='next'>${word.next.length}</div>`
      parent.appendChild(li)
    })
  }

  insertLastStat = async (data, options) => {
    const { id, word, timestamps } = data
    const { insert, duplicate } = options
    const section = document.getElementById(id)
    const box = section.childNodes[1]
    const value = box.childNodes[0]
    const ul = value.childNodes[0]
    if (!duplicate) this.removeDuplicate(ul, word.name)
    const li = document.createElement('li')
    let tooltip = `คำศัพท์ ${word.name}\n`
    tooltip += `เพิ่มเมื่อ ${thdate(new Date(word['create']), { time: true, full: true, thainum: true })}\n`
    tooltip += `แก้ไขเมื่อ ${thdate(new Date(word['modified']), { time: true, full: true, thainum: true })}\n`
    tooltip += `เชื่อมโยงมา ${thnum(word.previous.length)} คำศัพท์\n`
    tooltip += `เชื่อมโยงไป ${thnum(word.next.length)} คำศัพท์`
    li.setAttribute('title', tooltip)
    li.innerHTML = `<div class='date'>${thdate(new Date(word[timestamps]), { time: true })}</div>`
    li.innerHTML += `<div class='previous'>${word.previous.length}</div>`
    li.innerHTML += `<div class='word'>${word.name}</div>`
    li.innerHTML += `<div class='next'>${word.next.length}</div>`
    if (insert) { ul.insertBefore(li, ul.childNodes[0]) } else { ul.appendChild(li) }
  }

  removeDeleted = async (data) => {
    const { id, word } = data
    const section = document.getElementById(id)
    const box = section.childNodes[1]
    const value = box.childNodes[0]
    const ul = value.childNodes[0]
    this.removeDuplicate(ul, word.name)
  }

  removeDuplicate = (root, word) => {
    root.childNodes.forEach((li) => {
      if (li.childNodes[2].textContent == word) root.removeChild(li)
    })
  }
}