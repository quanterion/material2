import {Injectable} from '@angular/core';
import {OverlayContainer} from './overlay-container';

/**
 * The FullscreenOverlayContainer is the alternative to OverlayContainer
 * that supports correct displaying of overlay elements in Fullscreen mode
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
 * It should be provided in the root component that way:
 * providers: [
 *   {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
 * ],
 */
@Injectable()
export class FullscreenOverlayContainer extends OverlayContainer {
  protected _createContainer(): void {
    super._createContainer();
    this._adjustParentForFullscreenChange();
    this._addFullscreenChangeListener(() => this._adjustParentForFullscreenChange());
  }

  private _adjustParentForFullscreenChange(): void {
    if (!this._containerElement) {
      return;
    }
    let fullscreenElement = this.getFullscreenElement();
    let parent = fullscreenElement || document.body;
    parent.appendChild(this._containerElement);
  }

  private _addFullscreenChangeListener(fn: () => void) {
    if (document.fullscreenEnabled) {
      document.addEventListener('fullscreenchange', fn);
    } else if (document.webkitFullscreenEnabled) {
      document.addEventListener('webkitfullscreenchange', fn);
    } else if ((document as any).mozFullScreenEnabled) {
      document.addEventListener('mozfullscreenchange', fn);
    } else if ((document as any).msFullscreenEnabled) {
      document.addEventListener('MSFullscreenChange', fn);
    }
  }

  // When the page is put into fullscreen mode, a specific element is specified.
  // Only that element and its children are visible when in fullscreen mode.
  getFullscreenElement(): Element {
    return document.fullscreenElement ||
        document.webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement ||
        null;
  }

  // returns true if it has tried to toggle fullscreen mode
  // but provides no guarantees whether it really happened
  toggleFullscreen(element: HTMLElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullScreen) {
      (element as any).msRequestFullScreen();
    } else {
      return false;
    }
    return true;
  }
}
