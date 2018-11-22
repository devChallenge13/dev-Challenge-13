module Api
  module V1
    class BaseController < ::ApplicationController
      skip_before_action :verify_authenticity_token

      def render_error(error_message, status_code = 422)
        render json: { error: error_message }, status: status_code
      end
    end
  end
end
