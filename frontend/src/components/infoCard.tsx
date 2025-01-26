import React, { forwardRef, useImperativeHandle, useState } from "react";

import type { Ref } from "react";
import { InfoWindow } from "@vis.gl/react-google-maps";

type InfoCardProps = {
  position: google.maps.LatLngLiteral;
  content: string;
  onCloseClick?: () => void;
};

export const InfoCard = forwardRef(
  (props: InfoCardProps, ref: Ref<google.maps.InfoWindow | null>) => {
    const { position, content, onCloseClick } = props;
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
      null
    );

    useImperativeHandle(ref, () => infoWindow, [infoWindow]);

    return (
      <InfoWindow
        position={position}
        onCloseClick={onCloseClick}
        onLoad={setInfoWindow}
      >
        <div>{content}</div>
      </InfoWindow>
    );
  }
);
