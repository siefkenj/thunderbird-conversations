/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "../svgIcon.jsx";
import { browser } from "../../es-modules/thunderbird-compat.js";

/**
 * Determine if a background color is light enough to require dark text.
 *
 * @param {string} color
 * @returns {boolean}
 */
function isColorLight(color) {
  const rgb = color.substr(1) || "FFFFFF";
  const [, r, g, b] = rgb
    .match(/(..)(..)(..)/)
    .map((x) => parseInt(x, 16) / 255);
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return l > 0.8;
}

export function MessageTag({ onClickX, expanded, name, color }) {
  const isLight = isColorLight(color);

  return (
    <li
      className={"tag" + (isLight ? " light-tag" : "")}
      style={{ backgroundColor: color }}
    >
      {name}
      {expanded && (
        <span className="tag-x" onClick={onClickX}>
          {" "}
          x
        </span>
      )}
    </li>
  );
}
MessageTag.propTypes = {
  onClickX: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export function MessageTags({ expanded, tags = [], onTagsChange }) {
  function removeTag(tagId) {
    const filtered = tags.filter((tag) => tag.key !== tagId);
    if (filtered.length !== tags.length) {
      // Only trigger a change if we actually removed a tag
      onTagsChange(filtered);
    }
  }

  return (
    <ul className="tags regular-tags">
      {tags.map((tag, i) => (
        <MessageTag
          color={tag.color}
          expanded={expanded}
          key={i}
          name={tag.name}
          onClickX={() => {
            removeTag(tag.key);
          }}
        />
      ))}
    </ul>
  );
}
MessageTags.propTypes = {
  expanded: PropTypes.bool.isRequired,
  tags: PropTypes.array.isRequired,
  onTagsChange: PropTypes.func.isRequired,
};

function DkimTooltip({ strings }) {
  const [primaryString, secondaryStrings = []] = strings;
  const primaryTooltip = <div>{primaryString}</div>;
  const secondaryTooltip = secondaryStrings.length ? (
    <React.Fragment>
      <hr />
      {secondaryStrings.map((s, i) => (
        <div key={i}>{s}</div>
      ))}
      <div />
    </React.Fragment>
  ) : null;

  return (
    <span>
      {primaryTooltip}
      {secondaryTooltip}
    </span>
  );
}
DkimTooltip.propTypes = { strings: PropTypes.array.isRequired };

export function SpecialMessageTag({
  icon,
  name,
  title = "",
  tooltip = {},
  onClick = null,
  classNames,
}) {
  return (
    <li
      className={classNames + " special-tag" + (onClick ? " can-click" : "")}
      title={title}
      onClick={onClick}
    >
      <SvgIcon fullPath={icon} />
      {name}
      {tooltip.type === "dkim" && <DkimTooltip strings={tooltip.strings} />}
    </li>
  );
}

SpecialMessageTag.propTypes = {
  classNames: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClick: PropTypes.func,
  tooltip: PropTypes.object,
};

export function SpecialMessageTags({
  onTagClick,
  onFolderClick = null,
  specialTags,
  inView,
  folderName,
}) {
  let folderItem = null;
  if (folderName && !inView) {
    folderItem = (
      <li
        className="in-folder"
        onClick={onFolderClick}
        title={browser.i18n.getMessage("tags.jumpToFolder.tooltip")}
      >
        {browser.i18n.getMessage("tags.inFolder", [folderName])}
      </li>
    );
  }

  return (
    <ul className="tags special-tags">
      {specialTags &&
        specialTags.map((tag, i) => (
          <SpecialMessageTag
            classNames={tag.classNames}
            icon={tag.icon}
            key={i}
            name={tag.name}
            onClick={tag.details && ((event) => onTagClick(event, tag))}
            title={tag.title}
            tooltip={tag.tooltip}
          />
        ))}
      {folderItem}
    </ul>
  );
}

SpecialMessageTags.propTypes = {
  onTagClick: PropTypes.func.isRequired,
  onFolderClick: PropTypes.func,
  folderName: PropTypes.string.isRequired,
  inView: PropTypes.bool.isRequired,
  specialTags: PropTypes.array,
};
