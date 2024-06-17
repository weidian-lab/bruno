import { useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { debounce, get } from 'lodash';
import toast from 'react-hot-toast';
import { Modal, CodeEditor } from 'components/index';
import StyledWrapper from './StyledWrapper';

const CodeEditorModal = ({ mode, value, theme, collection, onClose, onChange }) => {
  const valueRef = useRef('');
  const editorRef = useRef(null);
  const preferences = useSelector((state) => state.app.preferences);

  useEffect(() => {
    try {
      if (mode === 'application/ld+json') {
        valueRef.current = JSON.stringify(JSON.parse(value), null, 2);
      } else {
        valueRef.current = value;
      }
    } catch (e) {
      valueRef.current = value;
    }
    valueRef.current = valueRef.current || '';
    editorRef.current.editor.setValue(valueRef.current);
  }, [value]);

  const autoFormat = useCallback(
    debounce(() => {
      try {
        if (mode === 'application/ld+json') {
          const newValueFormated = JSON.stringify(JSON.parse(valueRef.current), null, 2);
          if (newValueFormated !== valueRef.current) {
            editorRef.current.editor.setValue(newValueFormated);
          }
        }
      } catch (e) {}
    }, 1000),
    []
  );

  const onEdit = useCallback(
    debounce((newValue) => {
      valueRef.current = newValue;
      autoFormat(newValue);
    }, 300),
    []
  );

  const onSave = useCallback(() => {
    try {
      const newValue = mode === 'application/ld+json' ? JSON.stringify(JSON.parse(valueRef.current)) : valueRef.current;

      onChange(newValue);
      onClose();
    } catch (e) {
      toast.error(`Failed to parseValue ${valueRef.current}`);
    }
  }, []);

  return (
    <Modal size="lg" title="Query Editor" handleConfirm={onSave} handleCancel={onClose}>
      <StyledWrapper>
        <CodeEditor
          collection={collection}
          theme={theme}
          value={''}
          onEdit={onEdit}
          onSave={onSave}
          mode={mode}
          font={get(preferences, 'font.codeFont', 'default')}
          fontSize={get(preferences, 'font.codeFontSize')}
          allowNewlines={true}
          ref={editorRef}
        />
      </StyledWrapper>
    </Modal>
  );
};

export default CodeEditorModal;
