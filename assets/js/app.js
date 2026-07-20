import { loadProgress, saveProgress, exportProgress } from './storage.js';

const state = { workflow: null, progress: loadProgress() };
const departments = ['broadcast', 'vis', 'website', 'technical'];

async function init() {
  const response = await fetch('data/workflow.json');
  if (!response.ok) throw new Error('Unable to load workflow data.');
  state.workflow = await response.json();
  renderNavigation();
  renderWorkflow();
  updateDashboard();
  document.getElementById('exportButton').addEventListener('click', () => exportProgress(state.progress));
}

function renderNavigation() {
  const nav = document.getElementById('primaryNav');
  nav.innerHTML = '<a class="active" href="#dashboard">Dashboard</a>' + state.workflow.phases
    .map(phase => `<a href="#${phase.id}">${phase.name}</a>`).join('');
}

function renderWorkflow() {
  const container = document.getElementById('workflow');
  container.innerHTML = state.workflow.phases.map(phase => `
    <section class="phase-card" id="${phase.id}">
      <div class="phase-header"><h2>${phase.name}</h2><span class="badge" data-phase-progress="${phase.id}">0%</span></div>
      <div class="phase-content">
        ${phase.milestones.map(milestone => `
          <article class="milestone">
            <div class="milestone-header"><h3>${milestone.name}</h3><span class="badge" data-milestone-progress="${milestone.id}">0%</span></div>
            <div class="milestone-content">
              ${milestone.workstreams.map(workstream => `
                <section class="workstream">
                  <div class="workstream-header"><h4>${workstream.name}</h4><span class="badge">${workstream.department}</span></div>
                  <div class="workstream-content task-list">
                    ${workstream.tasks.map((task, index) => taskTemplate(phase.id, milestone.id, workstream, task, index)).join('')}
                  </div>
                </section>`).join('')}
            </div>
          </article>`).join('')}
      </div>
    </section>`).join('');

  container.querySelectorAll('.phase-header,.milestone-header,.workstream-header').forEach(header => {
    header.addEventListener('click', event => {
      if (event.target.closest('input')) return;
      header.parentElement.classList.toggle('collapsed');
    });
  });

  container.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      state.progress[input.dataset.taskId] = input.checked;
      saveProgress(state.progress);
      updateDashboard();
    });
  });
}

function taskTemplate(phaseId, milestoneId, workstream, task, index) {
  const taskId = `${phaseId}.${milestoneId}.${workstream.id}.${index}`;
  return `<label class="task"><input type="checkbox" data-task-id="${taskId}" data-phase="${phaseId}" data-milestone="${milestoneId}" data-department="${workstream.department}" ${state.progress[taskId] ? 'checked' : ''}><span>${task}</span></label>`;
}

function updateDashboard() {
  const tasks = [...document.querySelectorAll('input[type="checkbox"][data-task-id]')];
  const completed = tasks.filter(task => task.checked).length;
  const overall = percentage(completed, tasks.length);
  document.getElementById('dashboard').innerHTML = [
    metric('Overall Completion', `${overall}%`, overall),
    metric('Completed Subtasks', `${completed} of ${tasks.length}`),
    ...departments.map(department => {
      const group = tasks.filter(task => task.dataset.department === department);
      return metric(labelFor(department), `${percentage(group.filter(task => task.checked).length, group.length)}%`);
    })
  ].join('');

  document.querySelectorAll('[data-phase-progress]').forEach(badge => {
    const group = tasks.filter(task => task.dataset.phase === badge.dataset.phaseProgress);
    badge.textContent = `${percentage(group.filter(task => task.checked).length, group.length)}%`;
  });
  document.querySelectorAll('[data-milestone-progress]').forEach(badge => {
    const group = tasks.filter(task => task.dataset.milestone === badge.dataset.milestoneProgress);
    badge.textContent = `${percentage(group.filter(task => task.checked).length, group.length)}%`;
  });
}

function metric(label, value, progress = null) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong>${progress === null ? '' : `<div class="progress"><span style="width:${progress}%"></span></div>`}</article>`;
}
function percentage(done, total) { return total ? Math.round((done / total) * 100) : 0; }
function labelFor(value) { return ({broadcast:'Broadcast',vis:'VIS & Statistics',website:'Website & Bulletins',technical:'Technical Operations'})[value] || value; }

init().catch(error => {
  document.getElementById('workflow').innerHTML = `<p role="alert">${error.message}</p>`;
  console.error(error);
});
