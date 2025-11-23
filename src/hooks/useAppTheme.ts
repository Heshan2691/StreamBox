import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDark } from '../redux/slices/themeSlice';
import { RootState } from '../redux/store';

export const useAppTheme = () => {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const { mode, isDark } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (mode === 'auto') {
      dispatch(setIsDark(systemColorScheme === 'dark'));
    } else {
      dispatch(setIsDark(mode === 'dark'));
    }
  }, [mode, systemColorScheme, dispatch]);

  return { isDark, mode };
};
