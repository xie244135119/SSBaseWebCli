import React, { PureComponent } from "react";
import RouteIndex from "../../routeIndex";
import styles from "./directory.less";
import DefautSetting from "@/defaultSetting";

export default class Index extends PureComponent {
  render() {
    return (
      <div className={styles.background}>
        <h2>文件目录</h2>
        <h4>版本号：{DefautSetting.WEB_DEV_VERSION}</h4>
        {RouteIndex.getRoutes()
          .filter((item) => item.name != "" && item.name !== undefined)
          .map((item) => (
            <span key={item.path}>
              <a
                key={item.path}
                type='link'
                style={{ marginTop: 15 }}
                onClick={() => {
                  // eslint-disable-next-line react/prop-types
                  this.props.history.push(item.path);
                }}
              >
                {item.name}
              </a>
            </span>
          ))}
      </div>
    );
  }
}
