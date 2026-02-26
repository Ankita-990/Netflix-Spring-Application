package com.netflix.api.mapping;

import org.springframework.stereotype.Component;

import com.netflix.api.dto.ContentDTO;
import com.netflix.api.entity.Content;

@Component
public class MapContentDto {
	
	
	public ContentDTO contentToDto(Content content) {
		ContentDTO dto = new ContentDTO();
		dto.setId(content.getId());
		dto.setName(content.getName());
		dto.setCategory(content.getCategory());
		dto.setDescription(content.getDescription());
		
		return dto;
	}
	
	public Content dtoToContent(ContentDTO dto) {
		Content content = new Content();
		content.setId(dto.getId());
		content.setName(dto.getName());
		content.setCategory(dto.getCategory());
		content.setDescription(dto.getDescription());
		
		return content;
	}

}
