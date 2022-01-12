import * as React from "react";
import { Insight } from "../../domain/insight";
import styles from "./insights.module.css";

interface InsightsProps<T> {
  insights: Insight<T>[];
  data: T;
}

class InsightsItem extends React.Component<{ insight: Insight<any>; data: any }> {
  state: {
    status: "loading" | "success" | "failure";
  } = {
    status: "loading",
  };

  async componentDidMount() {
    const { insight } = this.props;
    const result = await insight.verify(this.props.data);
    this.setState({ status: result ? "success" : "failure" });
  }

  async componentDidUpdate(prevProps: { insight: Insight<any>; data: any }) {
    if (prevProps.data !== this.props.data) {
      this.setState({ status: "loading" });
      const result = await this.props.insight.verify(this.props.data);
      this.setState({ status: result ? "success" : "failure" });
    }
  }

  render() {
    const { insight } = this.props;
    const { status } = this.state;

    const statusClassName = {
      loading: styles["loading-insight"],
      success: styles["positive-insight"],
      failure: styles["negative-insight"],
    };

    const statusImageSrc = {
      loading: "/icons/loading.svg",
      success: "/icons/success.svg",
      failure: "/icons/failure.svg",
    };

    return (
      <div className={styles.insight + " " + statusClassName[status]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={statusImageSrc[status]} alt={status} />
        <div>{insight.description}</div>
      </div>
    );
  }
}

export class Insights<T> extends React.Component<InsightsProps<T>> {
  render() {
    return (
      <div>
        {this.props.insights.map((insight) => (
          <InsightsItem key={insight.name} insight={insight} data={this.props.data} />
        ))}
      </div>
    );
  }
}
