package com.wot.fit.api.dto;

import java.util.List;

public class SocialSuggestionsResponse {
  private List<SocialSuggestionDto> suggestions;

  public SocialSuggestionsResponse() {}

  public SocialSuggestionsResponse(List<SocialSuggestionDto> suggestions) {
    this.suggestions = suggestions;
  }

  public List<SocialSuggestionDto> getSuggestions() {
    return suggestions;
  }

  public void setSuggestions(List<SocialSuggestionDto> suggestions) {
    this.suggestions = suggestions;
  }
}
