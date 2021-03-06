import * as React from "react";
import { ILinksListProps } from "./ILinksListProps";
import { ILinksListState, Link } from "./ILinksListState";
import { DefaultButton, TextField, Label } from "office-ui-fabric-react";
import { autobind } from "@uifabric/utilities";
import * as strings from 'QuickLinksWebPartStrings';

export default class LinksList extends React.Component<ILinksListProps, ILinksListState> {
  constructor(props: ILinksListProps, state: ILinksListState) {
    super(props);

    let resetLinks = this.resetKeys(this.props.links || []);
    this.state = {
      links: resetLinks
    };
  }

  @autobind
  private resetKeys(links: Link[]): Link[] {
    return links.map((e, i) => {
      return {
        ...e,
        key: "link-" + i
      };
    });
  }

  @autobind
  private onAddLink() {
    let current = this.state.links;
    current.push({
      key: "link-" + this.state.links.length,
      value: "",
      label: ""
    });
    this.setState({
      links: current
    });
  }

  @autobind
  private onChanged(value: string, key: string, index: number): void {
    let newLinks = this.state.links;
    let alteredLink = newLinks[index];
    alteredLink[key] = value;
    this.setState({
      links: newLinks
    });
    if (this.props.onChanged) {
      this.props.onChanged(this.props.targetProperty, newLinks);
    }
  }

  @autobind
  private onRemove(key: string): void {
    let filtered = this.state.links.filter((link) => {
      return link.key !== key;
    });
    let resetFiltered = this.resetKeys(filtered);
    this.setState({
      links: resetFiltered
    });
    if (this.props.onChanged) {
      this.props.onChanged(this.props.targetProperty, resetFiltered);
    }
  }

  public render() {
    return <div className="linkListPropertyPane">
      <DefaultButton onClick={this.onAddLink}>Add</DefaultButton>
      {
        this.state.links != null ?
          this.state.links.map((e, i) => {
            return <div className="linkContainer" key={"link-container" + i}>
              <i title={strings.DeleteLinkHover} className={"remove ms-Icon ms-Icon--ChromeClose"} aria-hidden="true" onClick={() => this.onRemove(e.key)}></i>
              <Label>{strings.Link}</Label>
              <TextField
                className="linkLabel"
                key={e.key + "-title"}
                value={e.label}
                placeholder={strings.LinkLabelPlaceholder}
                onChanged={(value) => this.onChanged(value, "label", i)}
              />
              <TextField
                className="listLink"
                key={e.key}
                value={e.value}
                placeholder={strings.LinkPlaceholder}
                onChanged={(value) => this.onChanged(value, "value", i)}
              />
            </div>;
          })
          : null
      }
    </div>;
  }
}
