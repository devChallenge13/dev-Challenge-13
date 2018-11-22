db_conn = 'postgresql://postgres:example_pass@db:5432/tournaments'
random_words_list = 'http://svnweb.freebsd.org/csrg/share/dict/words?view=co&content-type=text/plain'


# import local config if exists
try:
    from local_config import *
except ImportError:
    pass
