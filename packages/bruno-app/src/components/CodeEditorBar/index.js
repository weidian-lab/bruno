import { useState, useCallback, useRef, forwardRef } from 'react';
import { debounce } from 'lodash';
import Dropdown from 'components/Dropdown';
import { getCodeMirrorModeBasedOnContentType } from 'utils/common/codemirror';
import CodeEditorModal from './CodeEditorModal';

import { IconDots } from '@tabler/icons';

const MenuIcon = forwardRef((props, ref) => (
  <div ref={ref} className="dropdown-icon cursor-pointer">
    <IconDots size={22} />
  </div>
));

const CodeEditorBar = ({ types, value, theme, onChange, collection }) => {
  const modeRef = useRef();
  const dropdownTippyRef = useRef();
  const [cachedValue, setCachedValue] = useState(value ? decodeURIComponent(value) : '');
  const [codeEditorModal, setCodeEditorModal] = useState(false);

  const debounceSave = useCallback(
    debounce((newValue) => {
      setCachedValue(newValue);
      onChange(encodeURIComponent(newValue));
    }, 300),
    []
  );

  return (
    <div className="mr-3">
      {codeEditorModal && (
        <CodeEditorModal
          mode={modeRef.current}
          value={cachedValue}
          onChange={debounceSave}
          collection={collection}
          theme={theme}
          onClose={() => setCodeEditorModal(false)}
        />
      )}

      <Dropdown onCreate={(ref) => (dropdownTippyRef.current = ref)} icon={<MenuIcon />} placement="bottom-start">
        {types.map((contentType) => (
          <div
            key={contentType}
            className="dropdown-item uppercase"
            onClick={(e) => {
              modeRef.current = getCodeMirrorModeBasedOnContentType(contentType);
              dropdownTippyRef.current.hide();
              setCodeEditorModal(true);
            }}
          >
            {contentType}
          </div>
        ))}
      </Dropdown>
    </div>
  );
};

export default CodeEditorBar;
