let limit = 1
const limitPlus = 1

function copyText(id, link, title) {
  const _link = CONFIG.server + "/" + id;
  console.log(_link)
  navigator.clipboard.writeText(`Vaga de emprego (${title}). Acesse o link: ${_link}`)
  alert("Link copiado para área de colagem, para compartilhamento!")
}

const Job = (id, title, category, expirity, link) => {
  return (`
    <div class="job">
      <div class="job-left">
        <a target="_blank" href="${link}" class="job-title">${title}</a>
        <p class="job-category">${category}</p>
        <p class="job-expirity-date"><b>Expira:</b> ${expirity}</p>
      </div>
      <div class="job-right">
        <i onClick="copyText('${id}', '${link}', '${title}')" class="la la-lg la-copy"></i>
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
        job._id,
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
  document.getElementById("btn-more").disabled = true;
  document.getElementById("btn-more").style.background = "#aaa"
  limit += limitPlus

  const c = document.getElementById("select-category").value
  if(c == "") {
    getJobs()
  } else {
    getJobsFromCategory(c)
  }
    
})

async function getJobs() {
  let jobs = ""
  const res = await fetch("/jobs/page/" + limit)
  const json = await res.json()
  const data = json.data

  data.forEach(job => {
    jobs += Job(
      job._id,
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
    document.getElementById("btn-more").style.background = "#2b22c1"
    document.getElementById("btn-more").disabled = false;
  }
}

async function getJobsFromCategory(cat) {
  let jobs = ""
  const res = await fetch("/jobs/category/" + cat + "/page/" + limit)
  const json = await res.json()
  const data = json.data

  data.forEach(job => {
    jobs += Job(
      job._id,
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
    document.getElementById("btn-more").style.background = "#2b22c1"
    document.getElementById("btn-more").disabled = false;
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

$("#btn-menu").click(() => {
  $("#slider-container").fadeIn(() => {
    $("#slider").animate({left: "0"})
  })

  $("body").css("overflow-y", "hidden")
})
  
document.getElementById("slider-container").addEventListener("click", e => {
  if(e.target.id == "slider-container") {
    $("#slider").animate({left: "-85%"}, () => {
      $("#slider-container").fadeOut()
    })
    $("body").css("overflow-y", "scroll")
  }
})