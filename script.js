const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalClientTitle = document.getElementById('modalClientTitle');
const modalToolsTitle = document.getElementById('modalToolsTitle');
const modalTools = document.getElementById('modalTools');
const modalGalleryTitle = document.getElementById('modalGalleryTitle');
const modalVideoTitle = document.getElementById('modalVideoTitle');
const modalDescriptionTitle = document.getElementById('modalDescriptionTitle');
const modalDescription = document.getElementById('modalDescription');


const characterViewer = document.getElementById('characterViewer');
const characterImage = document.getElementById('characterImage');
const frameRange = document.getElementById('frameRange');
const prevFrame = document.getElementById('prevFrame');
const nextFrame = document.getElementById('nextFrame');
const viewerCaption = document.getElementById('viewerCaption');

const modalVideoArea = document.getElementById('modalVideoArea');
const modalVideo =
    document.getElementById("modalVideo");

const modalVideoSource =
    document.getElementById("modalVideoSource");
const modalActions = document.getElementById("modalActions");

const modalGalleryArea = document.getElementById('modalGalleryArea');
const modalGallery = document.getElementById('modalGallery');
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryLightboxImage = document.getElementById('galleryLightboxImage');
const galleryLightboxClose = document.getElementById('galleryLightboxClose');

let characterFrames = [];
let currentFrame = 0;

function updateCharacterFrame(index) {
  if (!characterFrames.length) return;

  currentFrame = (index + characterFrames.length) % characterFrames.length;
  characterImage.src = characterFrames[currentFrame];
  frameRange.value = String(currentFrame);
  viewerCaption.textContent = `Ракурс ${currentFrame + 1} из ${characterFrames.length}`;
}

function openProjectModal(button) {
    modalClientTitle.textContent = button.dataset.modalClientTitle || 'Заказчик / формат';
    modalToolsTitle.textContent = button.dataset.modalToolsTitle || 'Программы для реализации проекта';
    modalTools.textContent =
    button.dataset.modalTools || '';
    modalGalleryTitle.textContent = button.dataset.modalGalleryTitle || 'Галерея проекта';
    modalVideoTitle.textContent = button.dataset.modalVideoTitle || 'Видео / 360° просмотр';

    modalDescriptionTitle.textContent =
    button.dataset.modalDescriptionTitle || "Описание";

    modalDescription.textContent =
    button.dataset.modalDescription || '';

    const link = button.dataset.modalLink;

    if (link) {
        modalActions.hidden = false;

        modalLink.href = link;
        modalLink.textContent =
            button.dataset.modalLinkTitle || "Открыть игру";
    } else {
        modalActions.hidden = true;
    }

  if (button.dataset.modalType === 'character') {
    characterFrames = [
      button.dataset.frame1,
      button.dataset.frame2,
      button.dataset.frame3,
      button.dataset.frame4
    ].filter(Boolean);

    characterViewer.hidden = false;
    updateCharacterFrame(0);
  } else {
    characterFrames = [];
    characterViewer.hidden = true;
  }

  const galleryItems = (button.dataset.modalGallery || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  modalGallery.innerHTML = '';

  if (galleryItems.length) {
    galleryItems.forEach((src, index) => {
      const image = document.createElement('img');
      image.src = src;
      image.alt = `Изображение проекта ${index + 1}`;
      image.loading = 'lazy';

      image.addEventListener('click', () => {
        galleryLightboxImage.src = src;
        galleryLightbox.classList.add('is-open');
        galleryLightbox.setAttribute('aria-hidden', 'false');
      });

      modalGallery.appendChild(image);
    });

    modalGalleryArea.hidden = false;
  } else {
    modalGalleryArea.hidden = true;
  }

    const videoUrl = button.dataset.modalVideo || '';

    if (videoUrl) {

        modalVideoSource.src = videoUrl;

        modalVideo.load();

        modalVideoArea.hidden = false;

    } else {

        modalVideo.pause();

        modalVideoSource.src = '';

        modalVideo.load();

        modalVideoArea.hidden = true;

    }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Очищаем iframe, чтобы видео останавливалось после закрытия модального окна.
  modalVideo.pause();
  modalVideoSource.src = '';
  modalVideo.load();
  modalGallery.innerHTML = '';
  modalGalleryArea.hidden = true;
}

document.querySelectorAll('.project-btn').forEach((button) => {
  button.addEventListener('click', () => openProjectModal(button));
});

document.querySelectorAll('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', closeProjectModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && galleryLightbox.classList.contains('is-open')) {
    closeGalleryLightbox();
    return;
  }

  if (event.key === 'Escape' && modal.classList.contains('is-open')) {
    closeProjectModal();
  }
});

function closeGalleryLightbox() {
  galleryLightbox.classList.remove('is-open');
  galleryLightbox.setAttribute('aria-hidden', 'true');
  galleryLightboxImage.src = '';
}

if (galleryLightboxClose) {
  galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
}

if (galleryLightbox) {
  galleryLightbox.addEventListener('click', (event) => {
    if (event.target === galleryLightbox) {
      closeGalleryLightbox();
    }
  });
}

if (prevFrame && nextFrame && frameRange) {
  prevFrame.addEventListener('click', () => updateCharacterFrame(currentFrame - 1));
  nextFrame.addEventListener('click', () => updateCharacterFrame(currentFrame + 1));

  frameRange.addEventListener('input', (event) => {
    updateCharacterFrame(Number(event.target.value));
  });
}
