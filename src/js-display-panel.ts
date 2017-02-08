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
    
    panel.appendChild(list);

    this.toggles.forEach(toggle => {
      list.appendChild(this.createToggleListItem(toggle));
    });

    return panel;
  }

  private createToggleList(): HTMLUListElement {
    return document.createElement('ul');
  }

  private createToggleListItem(toggle: ToggleStatus): HTMLLIElement {
    const li = document.createElement('li');
    li.appendChild(this.createToggleNameNode(toggle.Name));
    li.appendChild(this.createToggleStatusNode(toggle));

    return li;
  }

  private createToggleNameNode(name: string): Element {
    const nameNode = document.createElement('div');
    nameNode.classList.add('item-name');
    nameNode.innerHTML = name;

    return nameNode;
  }

  private createToggleStatusNode(toggle: ToggleStatus): Element {
    const statusNode = document.createElement('div');
    statusNode.classList.add('item-status');
    const toggleButton = document.createElement('a');
    toggleButton.setAttribute('href', this.createFeatureToggleLink(toggle));
    toggleButton.classList.add('btn');

    statusNode.appendChild(toggleButton);

    if (toggle.IsActive) {
      toggleButton.classList.add('active');
      toggleButton.innerHTML = 'Toggle Off';
    }
    else
      toggleButton.innerHTML = 'Toggle On';

    return statusNode;
  }

  private createFeatureToggleLink(toggle: ToggleStatus): string {
    const featureOnOffString = toggle.IsActive ? 'featureoff' : 'featureon',
          queryString = this.getQueryString(`${featureOnOffString}=${toggle.Name}`);
    return `${window.location.origin}${window.location.pathname}?${queryString}${window.location.hash}`;
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
