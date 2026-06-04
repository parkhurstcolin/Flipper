import PropTypes from 'prop-types';

// Centered loading spinner in the app's accent color.
// `inline` renders a smaller spinner for in-page "loading more" states;
// otherwise it fills the screen.
const Loading = ({ inline = false }) => {
  const wrapper = inline
    ? 'flex justify-center py-4'
    : 'flex min-h-screen items-center justify-center';
  const spinner = inline ? 'h-6 w-6 border-2' : 'h-12 w-12 border-4';

  return (
    <div className={wrapper}>
      <div
        className={`${spinner} animate-spin rounded-full border-gray-700 border-t-accent`}
        role='status'
        aria-label='Loading'
      />
    </div>
  );
};

Loading.propTypes = {
  inline: PropTypes.bool,
};

export default Loading;
