
let events = Array.from(document.getElementsByClassName('event'));

let selectedEvent = null;
let index = 0;

let ms = 7000;
let tick = 1000 / 60;

let progress = 0;
let progressPercentage = 0;
let eventProgress = document.getElementById('event-progress');

const selectEvent = () => {
  if(selectedEvent != null)
    selectedEvent.classList.add('hidden');

  selectedEvent = events[index];
  selectedEvent.classList.remove('hidden');

  index = (index+1) % events.length;
  progress = 0;
};

const updateProgress = () => {
  progress = progress + tick;

  if(progress+tick > ms) progressPercentage = 100;
  else progressPercentage = Math.min(progress / ms * 100, 100);

  eventProgress.style.width = `${progressPercentage}%`;
};

let hidden = false;
const hideProgress = () => {
  hidden = !hidden;
  if(hidden) eventProgress.classList.add('hidden');
  else eventProgress.classList.remove('hidden');
};

let switchLoop = Utils.coroutine(selectEvent, ms, true);
let progressLoop = Utils.coroutine(updateProgress, tick, true);
let hide = Utils.coroutine(hideProgress, 330);

(async () => {
  events.forEach(event => {
    event.onmouseover = () => {
      progress = 0;
      switchLoop.stop();
      progressLoop.stop();
      hide.setDirty();
      hideProgress();
    };
    event.onmouseout = async () => {
      switchLoop.resume();
      progressLoop.resume();
      hide.once();
    };
  });
})();
