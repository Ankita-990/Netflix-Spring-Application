package com.netflix.api.service;

import java.util.List;
import com.netflix.api.dto.ContentDTO;

public interface ContentService {
	
	ContentDTO addContent(ContentDTO contentDto);
	List<ContentDTO> getContents();
	ContentDTO getContentByName(String name);

}
