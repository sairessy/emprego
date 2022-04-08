let limit = 1
const limitPlus = 1

function copyText(link, title) {
  navigator.clipboard.writeText(`Vaga de emprego (${title}). Acesse o link: ${link}`)
  alert("Link copiado para área de colagem, para compartilhamento!")
}

const Job = (title, category, expirity, link) => {
  return (`
    <div class="job">
      <div class="job-left">
        <a target="_blank" href="${link}" class="job-title">${title}</a>
        <p class="job-category">${category}</p>
        <p class="job-expirity-date">Expira: ${expirity}</p>
      </div>
      <div class="job-right">
        <i onClick="copyText('${link}', '${title}')" class="la la-lg la-copy"></i>
      </div>
    </div>
  `)
}

getJobs()
getCategories()

document.getElementById("select-category").addEventListener("change", e => {
  limit = 1
  const v = e.target.value
  if(v == "") {
    getJobs()
    return
  }

  getJobsFromCategory(v)
})

document.getElementById("input-search").addEventListener("keyup",async e => {
  const text = e.target.value

  if(text == "") {
    getJobs()
    return
  }

  document.getElementById("btn-more").style.display = "none"
  let jobs = ""
  const res = await fetch(`/jobs/search/${text}/page/${limit}`)
  const json = await res.json()
  const data = json.data

  if(data.length > 0) {
    data.forEach(job => {
      jobs += Job(
        job.title,
        CONFIG.categories.filter(c => c.id == job.category)[0].label,
        job.expirityDate,
        job.link
      )
    })
    
    document.getElementById("jobs").innerHTML = jobs
  }
})

document.getElementById("btn-more").addEventListener("click", () => {
  document.getElementById("btn-more").style.display = "none"
  limit += limitPlus
  getJobs()
})

async function getJobs() {
  let jobs = ""
  const res = await fetch("/jobs/page/" + limit)
  const json = await res.json()
  const data = json.data

  data.forEach(job => {
    jobs += Job(
      job.title,
      CONFIG.categories.filter(c => c.id == job.category)[0].label,
      job.expirityDate,
      job.link
    )
  })

  document.getElementById("jobs").innerHTML = jobs

  if(json.reached) {
    document.getElementById("btn-more").style.display = "none"
  } else {
    document.getElementById("btn-more").style.display = "block"
  }
}

async function getJobsFromCategory(cat) {
  let jobs = ""
  const res = await fetch("/jobs/category/" + cat + "/page/" + limit)
  const json = await res.json()
  const data = json.data

  data.forEach(job => {
    jobs += Job(
      job.title,
      CONFIG.categories.filter(c => c.id == job.category)[0].label,
      job.expirityDate,
      job.link
    )
  })

  document.getElementById("jobs").innerHTML = jobs

  if(json.reached) {
    document.getElementById("btn-more").style.display = "none"
  } else {
    document.getElementById("btn-more").style.display = "block"
  }
}

function getCategories() {
  let cs = `<option value="">Todos</option>`
  CONFIG.categories.forEach(c => {
    cs += `<option value="${c.id}">${c.label}</option>`
  })
  document.getElementById("select-category").innerHTML = cs
}

// UX
document.getElementById("input-search").addEventListener("focus", () => {
  document.getElementById("input-search").setAttribute("placeholder", "Pesquisar")
})

document.getElementById("input-search").addEventListener("blur", () => {
  document.getElementById("input-search").setAttribute("placeholder", "")
})