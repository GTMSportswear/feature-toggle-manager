import { ToggleStatus } from './js-feature-toggle-manager';
import { QueryStringReader } from './github/gtmsportswear/js-utilities@1.0.0/js-utilities';

export abstract class DisplayPanel {
  public draw(): Element {
    const panel = document.createElement('div');
    panel.classList.add('display-panel');

    return panel;
  }
}

export class FeatureToggleDisplayPanel extends DisplayPanel {
  constructor(private toggles: ToggleStatus[]) {
    super();
  }

  public draw(): Element {
    const panel = super.draw(),
          list = this.createToggleList();
    
    panel.appendChild(this.createTitleNode());
    panel.appendChild(list);

    this.toggles.forEach(toggle => {
      list.appendChild(this.createToggleListItem(toggle));
    });

    panel.appendChild(this.createHidePanelButton());

    return panel;
  }

  private createTitleNode(): Element {
    const titleNode = document.createElement('h2');
    titleNode.innerHTML = 'Feature Toggles';

    return titleNode;
  }

  private createHidePanelButton(): Element {
    const hidePanelButton = document.createElement('button');
    hidePanelButton.classList.add('display-panel__hide');
    hidePanelButton.innerHTML = 'Hide Panel';

    return hidePanelButton;
  }

  private createToggleList(): HTMLUListElement {
    return document.createElement('ul');
  }

  private createToggleListItem(toggle: ToggleStatus): HTMLLIElement {
    const li = document.createElement('li');
    li.appendChild(this.createToggleStatusNode(toggle));
    li.appendChild(this.createToggleNameNode(toggle.Name));

    return li;
  }

  private createToggleNameNode(name: string): Element {
    const nameNode = document.createElement('div');
    nameNode.classList.add('item-name');
    nameNode.innerHTML = name;

    return nameNode;
  }

  private createToggleStatusNode(toggle: ToggleStatus): Element {
    const featureToggleUpdateLink = this.createFeatureToggleLink(toggle);
    
    const statusNode = document.createElement('label');
    statusNode.classList.add('item-status');
    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.setAttribute('type', 'checkbox');
    
    const sliderDisplayNode = document.createElement('span');
    sliderDisplayNode.classList.add('slider');
    sliderDisplayNode.setAttribute('data-reload-href', featureToggleUpdateLink);
    sliderDisplayNode.addEventListener('click', e => {
      e.preventDefault();

      this.reloadPageWithUpdatedQueryString(featureToggleUpdateLink);
    });

    statusNode.appendChild(toggleCheckbox);
    statusNode.appendChild(sliderDisplayNode);

    if (toggle.IsActive)
      toggleCheckbox.setAttribute('checked', 'true');
    else
      toggleCheckbox.removeAttribute('checked');

    return statusNode;
  }

  private createFeatureToggleLink(toggle: ToggleStatus): string {
    const featureOnOffString = toggle.IsActive ? 'featureoff' : 'featureon',
          queryString = this.getQueryString(`${featureOnOffString}=${toggle.Name}`);
    return `${window.location.origin}${window.location.pathname}?${queryString}${window.location.hash}`;
  }

  private reloadPageWithUpdatedQueryString(updateLink: string): void {
    setTimeout(() => {
      window.location.href = updateLink;
    }, 200);
  }

  private getQueryString(featureCommandQueryString: string): string {
    const qsReader = new QueryStringReader(),
          qsPairs = qsReader.getAttributesAndValues();
    let returnQueryString = '';

    qsPairs.forEach(pair => {
      if (pair.name !== '' && pair.name !== 'featureon' && pair.name !== 'featureoff')
        returnQueryString += `${pair.name}=${pair.value}&`;
    });

    returnQueryString += featureCommandQueryString;
    
    return returnQueryString;
  }
}

export interface IDisplayPanelFactory {
  createDisplayPanel: () => DisplayPanel;
}

export class FeatureToggleDisplayPanelFactory implements IDisplayPanelFactory {
  constructor(private toggles: ToggleStatus[]) {}

  public createDisplayPanel(): FeatureToggleDisplayPanel {
    return new FeatureToggleDisplayPanel(this.toggles);
  }
}
