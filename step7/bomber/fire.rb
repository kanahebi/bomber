module Bomber
  class Fire < Bomber::Character
    def initialize(x, y)
      super("../image/fire.png", x, y, 0)
    end
  end
end