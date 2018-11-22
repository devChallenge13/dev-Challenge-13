redis_url = ENV['REDIS_URL'] || [
  'redis://', ENV['REDIS_HOST'], ':', ENV['REDIS_PORT'], '/', ENV['REDIS_INDEX']
].join('')

Redis.current = Redis.new(url: redis_url)
