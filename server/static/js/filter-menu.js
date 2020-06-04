const details = document.querySelectorAll('details'),
  filterSearch = document.getElementById('js-searchFilter'),
  filtersForm = document.getElementById('js-filtersForm');
const checkboxes = filtersForm.querySelectorAll('input[type="checkbox"]'),
  labels = filtersForm.querySelectorAll('label');
let allFilters = [];
console.log(details);
filterSearch.oninput = function input() {
  const value = this.value;
  console.log(value);
};
checkboxes.forEach((item) => {
  const name = item.name,
    mainFilter = item.getAttribute('data-main-filter'),
    label = item.childNodes;
  allFilters.push({ name: name, main: mainFilter, item: item });
});
console.log(allFilters);
allFilters.forEach((item) => {
  item.name.includes('gen') ? console.log(item.main) : console.log(false);
});
// details[0].innerText

function openDetails(i) {
  details[i].setAttribute('open', true);
  if (details[i].classList.contains('d-none')) {
    details[i].classList.toggle('d-none');
  }
}
function closeDetails(i) {
  details[i].removeAttribute('open');
  if (!details[i].classList.contains('d-none')) {
    details[i].classList.toggle('d-none');
  }
}
function checkDetails(i) {
  const check = details[i].getAttribute('open');
  return check ? true : false;
}
checkDetails(0);
function _testing() {
  const val = filterSearch.value.toUpperCase();
  let toOpen = [];
  for (let i = 0, length = allFilters.length; i < length; i++) {
    let _el = allFilters[i];
    let textval = _el.name;
    const detailsIndex = allFilters[i].main;

    if (val == '') {
      details.forEach(function (item) {
        const _checkboxes = item.querySelectorAll('input[type="checkbox"]');
        const _labels = item.querySelectorAll('label');
        if (item.getAttribute('open')) {
          item.removeAttribute('open');
        }
        _checkboxes.forEach(function (item) {
          if (item.classList.contains('d-none')) {
            item.classList.toggle('d-none');
          }
        });
        _labels.forEach(function (item) {
          if (item.classList.contains('d-none')) {
            item.classList.toggle('d-none');
          }
        });
      });
    } else if (textval.toUpperCase().indexOf(val) > -1) {
      if (!toOpen.includes(detailsIndex)) {
        toOpen.push(detailsIndex);
      }
      if (allFilters[i].item.classList.contains('d-none')) {
        allFilters[i].item.classList.toggle('d-none');
        labels[i].classList.toggle('d-none');
      }
    } else {
      if (!allFilters[i].item.classList.contains('d-none')) {
        allFilters[i].item.classList.toggle('d-none');
        labels[i].classList.toggle('d-none');
      }
    }
  }
  for (let z = 0, length = 12; z < length; z++) {
    console.log('has');
    console.log(z);
    console.log(toOpen);
    if (toOpen.length !== 0) {
      toOpen.includes(`${z}`) ? openDetails(z) : closeDetails(z);
    } else {
      details.forEach(function (item) {
        if (item.classList.contains('d-none')) {
          item.classList.toggle('d-none');
        }
      });
    }
  }
}
filterSearch.addEventListener('keyup', _testing);

// leeg ? alles weergeven maar dicht
// match ? weergeven en open
// geen match ? niet weergeven
